import { PageData, NoteData } from './types'
import {
    StandardSearchResponse,
    AnnotPage,
    AnnotationsSearchResponse,
} from 'src/search/background/types'
import { Annotation } from 'src/annotations/types'

const pageDataToSearchRes = (
    page: PageData,
    notes: NoteData[] = [],
): AnnotPage => ({
    url: page.normalizedUrl,
    title: page.title,
    hasBookmark: page.isBookmarked,
    annotations: notes.map((note) => noteDataToSearchRes(note, page)),
    annotsCount: notes.length,
    displayTime: page.displayTime,
})

const noteDataToSearchRes = (
    note: NoteData,
    page: PageData,
    tags: string[] = [],
): Annotation => ({
    createdWhen: new Date(note.displayTime),
    pageUrl: page.normalizedUrl,
    comment: note.comment,
    body: note.highlight,
    url: note.url,
    tags,
})

export const DAY_1 = new Date('2020-11-26').getTime()
export const DAY_2 = new Date('2020-11-27').getTime()

export const PAGE_1: PageData = {
    normalizedUrl: 'test.com',
    fullUrl: 'https://test.com',
    isBookmarked: false,
    title: 'Test page',
    displayTime: new Date('2020-11-26T01:00').getTime(),
}

export const PAGE_2: PageData = {
    normalizedUrl: 'getmemex.com',
    fullUrl: 'https://getmemex.com',
    isBookmarked: false,
    title: 'Memex ext is good',
    displayTime: new Date('2020-11-26T05:00').getTime(),
}

export const PAGE_3: PageData = {
    normalizedUrl: 'getmemex.com/sub',
    fullUrl: 'https://getmemex.com/sub',
    isBookmarked: false,
    title: 'Memex ext is a web extension',
    displayTime: new Date('2020-11-26T05:10').getTime(),
}

export const NOTE_1: NoteData = {
    url: PAGE_1.normalizedUrl + '#0123456789',
    displayTime: new Date('2020-11-26T01:05').getTime(),
    comment: 'Test webpage internet javascript',
    tags: [],
}

export const NOTE_2: NoteData = {
    url: PAGE_1.normalizedUrl + '#01234567811',
    displayTime: new Date('2020-11-26T01:07').getTime(),
    comment: 'webpage internet javascript',
    highlight: 'Some test text',
    tags: [],
}

export const NOTE_3: NoteData = {
    url: PAGE_1.normalizedUrl + '#0123456789123',
    displayTime: new Date('2020-11-27T18:05').getTime(),
    comment: 'Test webpage internet javascript deer',
    tags: [],
}

export const NOTE_4: NoteData = {
    url: PAGE_3.normalizedUrl + '#012345678912213',
    displayTime: new Date('2020-11-26T05:15').getTime(),
    comment: 'Memex is a web extensions',
    highlight: 'memex web extension chrome firefox browser',
    tags: [],
}

export const NOTE_5: NoteData = {
    url: PAGE_3.normalizedUrl + '#012345678912309',
    displayTime: new Date('2020-11-27T18:15').getTime(),
    highlight: 'memex deer duck garage',
    tags: [],
}

export const PAGE_SEARCH_RESULT_1: StandardSearchResponse = {
    docs: [PAGE_1, PAGE_2, PAGE_3].map((data) => pageDataToSearchRes(data)),
    resultsExhausted: false,
}

export const PAGE_SEARCH_RESULT_2: StandardSearchResponse = {
    docs: [
        pageDataToSearchRes(PAGE_1, [NOTE_1, NOTE_2, NOTE_3]),
        pageDataToSearchRes(PAGE_2, []),
        pageDataToSearchRes(PAGE_3, [NOTE_4, NOTE_5]),
    ],
    resultsExhausted: false,
}

export const ANNOT_SEARCH_RESULT_1: AnnotationsSearchResponse = {
    isAnnotsSearch: true,
    resultsExhausted: false,
    docs: [PAGE_1, PAGE_2, PAGE_3].map((data) => pageDataToSearchRes(data)),
    annotsByDay: {
        [DAY_1]: {
            [PAGE_1.normalizedUrl]: [],
            [PAGE_2.normalizedUrl]: [],
            [PAGE_3.normalizedUrl]: [],
        },
    },
}

export const ANNOT_SEARCH_RESULT_2: AnnotationsSearchResponse = {
    isAnnotsSearch: true,
    resultsExhausted: false,
    docs: [PAGE_1, PAGE_2, PAGE_3].map((data) => pageDataToSearchRes(data)),
    annotsByDay: {
        [DAY_1]: {
            [PAGE_1.normalizedUrl]: [NOTE_1, NOTE_2].map((note) =>
                noteDataToSearchRes(note, PAGE_1),
            ),
            [PAGE_2.normalizedUrl]: [],
            [PAGE_3.normalizedUrl]: [NOTE_4].map((note) =>
                noteDataToSearchRes(note, PAGE_3),
            ),
        },
        [DAY_2]: {
            [PAGE_1.normalizedUrl]: [NOTE_3].map((note) =>
                noteDataToSearchRes(note, PAGE_1),
            ),
            [PAGE_3.normalizedUrl]: [NOTE_5].map((note) =>
                noteDataToSearchRes(note, PAGE_3),
            ),
        },
    },
}
