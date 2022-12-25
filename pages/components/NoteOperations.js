import styles from "../../styles/Home.module.scss";
import { useState, useEffect } from "react";
import { app, db } from "../../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(import("react-quill"), { ssr: false });

export default function NoteOperations({ getSingleNote }) {
  const [isInputVisible, setInputVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDesc, setNoteDesc] = useState("");
  const [notesArray, setNotesArray] = useState([]);

  const addDesc = (value) => {
    setNoteDesc(value);
  };

  const dbInstance = collection(db, "notes");

  const inputToggle = () => {
    setInputVisible(!isInputVisible);
  };

  const saveNote = () => {
    try {
      addDoc(dbInstance, {
        noteTitle: noteTitle,
        noteDesc: noteDesc,
      }).then(() => {
        setNoteTitle("");
        setNoteDesc("");
        getNotes();
      });
      alert("NOTE ADDED");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const getNotes = () => {
    getDocs(dbInstance).then((data) => {
      setNotesArray(
        data.docs.map((item) => {
          return { ...item.data(), id: item.id };
        })
      );
    });
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <>
      <div className={styles.btnContainer}>
        <button onClick={inputToggle} className={styles.button}>
          Add a New Note
        </button>
      </div>
      {isInputVisible ? (
        <>
          <div className={styles.inputContainer}>
            <input
              className={styles.input}
              placeholder="Enter the Title.."
              onChange={(e) => setNoteTitle(e.target.value)}
              value={noteTitle}
            />
          </div>

          <div className={styles.ReactQuill}>
            <ReactQuill
              theme="bubble"
              onChange={addDesc}
              placeholder="Write description"
              value={noteDesc}
            />
          </div>
        </>
      ) : (
        <></>
      )}

      <button className={styles.saveBtn} onClick={saveNote}>
        Save Note
      </button>
      <div className={styles.notesDisplay}>
        {notesArray.map((note) => {
          return (
            <div
              key={note.id}
              className={styles.notesInner}
              onClick={() => getSingleNote(note.id)}
            >
              <h4>{note.noteTitle}</h4>
              {/* <div dangerouslySetInnerHTML={{ __html: note.noteDesc }}></div> */}
            </div>
          );
        })}
      </div>
    </>
  );
}
