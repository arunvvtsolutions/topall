import { openDB } from 'idb';

// Initialize IndexedDB
const initDB = async () => {
  return openDB('examDB', 1, {
    upgrade(db) {
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains('testState')) {
        db.createObjectStore('testState');
      }
      if (!db.objectStoreNames.contains('answers')) {
        db.createObjectStore('answers');
      }
      if (!db.objectStoreNames.contains('sectionsList')) {
        db.createObjectStore('sectionsList');
      }
    }
  });
};

// Initialize test state
export async function initializeTestState(testId: string, data?: any) {
  const db = await initDB();
  const tx = db.transaction('testState', 'readwrite');
  const store = tx.objectStore('testState');

  // Check if test state already exists
  const existingState = await store.get(testId);

  if (!existingState) {
    // Create new test state
    await store.put(
      {
        last_quesId: 1,
        remaining_time: 3 * 60 * 60, // 3 hours in seconds
        subject_id: 0,
        last_section: '1',
        is_submited: false,
        offline: [],
        status: 'start',
        testId: testId
      },
      testId
    );
  }

  return await tx.done;
}

// Get test state
export async function getTestState(testId: string) {
  const db = await initDB();
  return db.get('testState', testId);
}

// Save test state
export async function saveTestState(testId: string, data: any, partial = false) {
  const db = await initDB();
  const tx = db.transaction('testState', 'readwrite');
  const store = tx.objectStore('testState');

  if (partial) {
    // Update only specified fields
    const existingState = await store.get(testId);
    if (existingState) {
      await store.put({ ...existingState, ...data }, testId);
    }
  } else {
    await store.put(data, testId);
  }

  return await tx.done;
}

// Get answers
export async function getAnswers(testId: string) {
  const db = await initDB();
  return db.get('answers', testId);
}

// Save answers
export async function saveAnswers(testId: string, answers: any[]) {
  const db = await initDB();
  return db.put('answers', answers, testId);
}

// Get sections list
export async function getSectionsList(testId: string) {
  const db = await initDB();
  return db.get('sectionsList', testId);
}

// Save sections list
export async function saveSectionsList(testId: string, sectionsList: any[]) {
  const db = await initDB();
  return db.put('sectionsList', sectionsList, testId);
}

// Convert API attempt data to answers format
export async function convertAttemptsToAnswers(attempts: any[]) {
  if (!attempts || !Array.isArray(attempts)) return [];

  return attempts.map((attempt) => ({
    questionId: Number.parseInt(attempt.question_id),
    ans: attempt.selected_option,
    mark_for_review: attempt.is_review ? 1 : 0,
    time_taken: attempt.time_spent
  }));
}

// Find question by ID across all sections
export async function findQuestionById(sections: any[], questionId: number) {
  for (const section of sections) {
    const question = section.questions.find((q: any) => q.questionId === questionId);
    if (question) {
      return {
        question,
        sectionId: section.sectionId.toString()
      };
    }
  }
  return null;
}

export async function clearDB() {
  const db = await initDB();
  await db.clear('testState');
  await db.clear('answers');
  await db.clear('sectionsList');
}
