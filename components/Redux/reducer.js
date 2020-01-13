

// initial state
const initialState = {
	type: ''
};

// Reducer Function

const reducer = (state=initialState, action) => {
	//  console.log(state,action,'state,action')
 console.log(state, 'state,action')
	switch (action.type) {
		case 'updateType':
			// handle the action here using helper functions

			return {...initialState, ...{type:action.payload.type}}
		default:
			return state;
	}
}
export default reducer;