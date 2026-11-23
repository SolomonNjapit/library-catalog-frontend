import { createContext, useEffect, useMemo, useState } from "react";

export const ReadingListContext = createContext(null);

const STORAGE_KEY = "fieldnotes-reading-list";

export function ReadingListProvider({ children }) {
  const [readingList, setReadingList] = useState([]);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) {
          throw new Error("Saved reading list must be a list.");
        }
        setReadingList(parsed);
      }
    } catch (error) {
      setStorageError(`Reading list storage is unavailable: ${error.message}`);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(readingList));
      setStorageError("");
    } catch (error) {
      setStorageError(`Reading list changes could not be saved: ${error.message}`);
    }
  }, [readingList, ready]);

  const value = useMemo(() => {
    function addBook(book) {
      const id = book.id ?? book._id;
      setReadingList((current) => {
        if (current.some((item) => String(item.id ?? item._id) === String(id))) {
          return current;
        }
        return [...current, book];
      });
    }

    function removeBook(bookOrId) {
      const id = typeof bookOrId === "object"
        ? bookOrId.id ?? bookOrId._id
        : bookOrId;
      setReadingList((current) =>
        current.filter((book) => String(book.id ?? book._id) !== String(id)),
      );
    }

    function clearList() {
      setReadingList([]);
    }

    return { readingList, addBook, removeBook, clearList, storageError, ready };
  }, [readingList, storageError, ready]);

  return (
    <ReadingListContext.Provider value={value}>
      {children}
    </ReadingListContext.Provider>
  );
}
