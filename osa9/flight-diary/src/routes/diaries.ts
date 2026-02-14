import express from "express";
import diaryService from "../services/diaryService";
import toNewDiaryEntry from "../utils";

const router = express.Router();

// Return non-sensitive diary entries (no comment)
router.get("/", (_req, res) => {
  res.json(diaryService.getNonSensitiveEntries());
});

// Return a single diary entry by id (includes comment)
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const diary = diaryService.findById(id);

  if (!diary) {
    res.sendStatus(404);
    return;
  }

  res.json(diary);
});

// Add a new diary entry
router.post("/", (req, res) => {
  try {
    const newDiaryEntry = toNewDiaryEntry(req.body);
    const addedEntry = diaryService.addDiary(newDiaryEntry);
    res.status(201).json(addedEntry);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    } else {
      res.status(400).send("Unknown error");
    }
  }
});

export default router;
