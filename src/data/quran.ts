// Sample reading position until the Qur'an reader and saved progress exist.
export const MUSHAF_PAGES = 604;
const START_PAGE = 290;

export const readingPage = (pagesToday: number) => START_PAGE + pagesToday;
export const juzForPage = (page: number) => Math.min(30, Math.floor((page - 2) / 20) + 1);
