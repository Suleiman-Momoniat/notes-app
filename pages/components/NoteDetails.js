import dynamic from "next/dynamic";
import styles from "../../styles/Home.module.scss";
import { useState, useEffect } from "react";
import { app, db } from "../../firebaseConfig";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
const dbInstance = collection(db, "notes");
const ReactQuill = dynamic(import("react-quill"), { ssr: false });

export default function NoteDetails({ ID }) {
  const [singleNote, setSingleNote] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDesc, setNoteDesc] = useState("");
  const getSingleNote = async () => {
    if (ID) {
      const singleNote = doc(db, "notes", ID);
      const data = await getDoc(singleNote);
      setSingleNote({ ...data.data(), id: data.id });
    }
  };

  const getNotes = () => {
    getDocs(dbInstance).then((data) => {
      setSingleNote(
        data.docs.map((item) => {
          return { ...item.data(), id: item.id };
        })[0]
      );
    });
  };

  const getEditData = () => {
    setIsEdit(true);
    setNoteTitle(singleNote.noteTitle);
    setNoteDesc(singleNote.noteDesc);
  };

  useEffect(() => {
    getNotes();
  }, []);

  useEffect(() => {
    getSingleNote();
  }, [ID]);

  const editNote = (id) => {
    const collectionById = doc(db, "notes", id);

    updateDoc(collectionById, {
      noteTitle: noteTitle,
      noteDesc: noteDesc,
    }).then(() => {
      window.location.reload();
    });
  };

  const deleteNote = (id) => {
    const collectionById = doc(db, "notes", id);

    deleteDoc(collectionById).then(() => {
      window.location.reload();
    });
  };
  return (
    <>
      <div>
        <button className={styles.editBtn} onClick={getEditData}>
          Edit
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => deleteNote(singleNote.id)}
        >
          Delete
        </button>
      </div>
      {isEdit ? (
        <div className={styles.inputContainer}>
          <input
            className={styles.input}
            placeholder="Enter the Title.."
            onChange={(e) => setNoteTitle(e.target.value)}
            value={noteTitle}
          />
          <div className={styles.ReactQuill}>
            <ReactQuill onChange={setNoteDesc} value={noteDesc} />
          </div>
          <button
            onClick={() => editNote(singleNote.id)}
            className={styles.saveBtn}
          >
            Update Note
          </button>
        </div>
      ) : (
        <></>
      )}
      <h2>{singleNote.noteTitle}</h2>
      <div dangerouslySetInnerHTML={{ __html: singleNote.noteDesc }}></div>
    </>
  );
}
