import { UILogic, UIEventHandler, UIEvent } from 'ui-logic-core'
import type { ActivityIndicatorInterface } from '../background'
import { getLocalStorage, setLocalStorage } from 'src/util/storage'

export interface Dependencies {
    activityIndicatorBG: Pick<
        ActivityIndicatorInterface,
        'checkActivityStatus' | 'markActivitiesAsSeen'
    >
    openFeedUrl: () => void
}

export interface State {
    isShown: boolean
    hasFeedActivity: boolean
}

export type Events = UIEvent<{
    clickFeedEntry: null
}>

type EventHandler<EventName extends keyof Events> = UIEventHandler<
    State,
    Events,
    EventName
>

export default class Logic extends UILogic<State, Events> {
    constructor(private dependencies: Dependencies) {
        super()
    }

    getInitialState(): State {
        return {
            isShown: true,
            hasFeedActivity: false,
        }
    }

    init: EventHandler<'init'> = async () => {
        const hasActivityStored = await getLocalStorage('feedactivity')
        if (hasActivityStored === true) {
            this.emitMutation({
                hasFeedActivity: { $set: true },
            })
        } else {
            const activityStatus = await this.dependencies.activityIndicatorBG.checkActivityStatus()
            await setLocalStorage(
                'feedactivity',
                activityStatus === 'has-unseen',
            )
            this.emitMutation({
                hasFeedActivity: { $set: activityStatus === 'has-unseen' },
            })
        }
    }

    clickFeedEntry: EventHandler<'clickFeedEntry'> = async ({
        previousState,
    }) => {
        this.dependencies.openFeedUrl()

        if (previousState.hasFeedActivity) {
            const hasActivityStored = await setLocalStorage(
                'feedactivity',
                false,
            )
            this.emitMutation({ hasFeedActivity: { $set: false } })
            await this.dependencies.activityIndicatorBG.markActivitiesAsSeen()
        }
    }
}
