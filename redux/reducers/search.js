import { SEARCH_STATE_CHANGE } from "../constants/index"

const initialState = {
    currentSearch: "temporary search",
}

export const search = (state = initialState, action) => {
    switch(action.type) {
        case SEARCH_STATE_CHANGE:
            return {
                ...state,
                currentSearch: action.currentSearch
            }
        default:
            return state;
        
    }
}