import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const sortByVotes = (anecdotes) =>
  [...anecdotes].sort((a, b) => b.votes - a.votes);

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return sortByVotes(action.payload);
    },
    createAnecdote(state, action) {
      return sortByVotes(state.concat(action.payload));
    },
    // päivitetään äänestysluku Redux-tilaan
    voteAnecdote(state, action) {
      const updated = action.payload;
      const next = state.map((a) => (a.id !== updated.id ? a : updated));
      return sortByVotes(next);
    },
  },
});

const { setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const created = await anecdoteService.createNew(content);
    dispatch(anecdoteSlice.actions.createAnecdote(created));
  };
};

// Äänestys talteen backendiin
export const voteAnecdote = (id) => {
  return async (dispatch, getState) => {
    const { anecdotes } = getState();
    const toVote = anecdotes.find((a) => a.id === id);
    const updated = { ...toVote, votes: toVote.votes + 1 };

    const saved = await anecdoteService.update(updated);
    dispatch(anecdoteSlice.actions.voteAnecdote(saved));
  };
};

export default anecdoteSlice.reducer;
