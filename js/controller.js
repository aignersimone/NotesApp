import { getInstance as Model } from "./model.js";
import { getInstance as View } from "./view.js";
import Note from "./note.js";

let controller;

class Controller {
    constructor(){
        this.#init();
        let model = Model();
        let view = View();
        model.subscribe("addNote", view, view.addNote);
    }

    #init(){
        let DOM = View().getDOM();
        // input handler
        // Durch bind(this) wird sichergestellt, dass this innerhalb der Funktionen
        // auf die Instanz des Controller verwiesen wird.
        DOM.nav.onclick = this.handleNavigationClick.bind(this);
        DOM.tagList.onclick = this.handleTagListClick.bind(this);
        DOM.noteList.onclick = this.handleNoteListClick.bind(this);
        DOM.Form.onclick = this.handleFormClick.bind(this);
        DOM.SaveAndChangeAndDeleteTagAndNotes.onclick = this.handleSaveChangeDeleteClick.bind(this);
    }

    // Navigation klick
    handleNavigationClick(ev) {
        let navitem = ev.target.closest(".nav-link");
        let navitemid = navitem.id;
        //console.log(navitemid);

        //Alle active klassen entfernen der nav-links
        document.querySelectorAll(".nav-link").forEach((item) => {
            item.classList.remove("active");
        });

        //'active'-Klasse zum angeklickten NAV-Element hinzufügen, um es sichtbar zu machen
        navitem.classList.add("active");

        View().printHeader(navitemid);
        View().printList(navitemid);
    }

    // Tag list klick - Details aufrufen
    handleTagListClick(ev) {
        //fetch the tag
        let tagElement = ev.target.closest(".tag-element");
        //console.log(tagElement)
        let tag = tagElement.id;
        //console.log(tag)
        View().printTagDetail(tag);
    }

    // Note list klick - Note Details aufrufen
    handleNoteListClick(ev) {
        let insArchivIcon = ev.target.closest(".insArchiv");
        let ausArchivIcon = ev.target.closest(".ausArchiv");
        let noteElement = ev.target.closest(".node-element");
        if (noteElement) {
            let id = noteElement.id;
            //console.log(noteElement, id);
            let index = id.lastIndexOf("_");
            id = id.substring(index + 1);
            //console.log(id);
            let selectedNote = Model().getNoteById(Number(id));
            //console.log(selectedNote);
            View().printNoteDetail(selectedNote);
        }

        if (insArchivIcon) {
            let noteId = insArchivIcon.dataset.noteId;
            // Hier kannst du die Funktion aufrufen, die auf das Ins-Archiv-Icon reagiert
            console.log("Ins Archiv geklickt für Notiz mit ID:", noteId);
            let insArchiv = Model().insArchiv(noteId);
            if (insArchiv) {
                //console.log("SAVE TAG", tagnameValue);
                alert("Notiz wurde erfolgreich in das Archiv gegeben!");
                // Ladet die Tag-Liste neu mit dem neuen Tag
                View().printList("notizen");
            } else {
                alert("Notiz wurde nicht archiviert!");
            }
        }

        if (ausArchivIcon) {
            let noteId = ausArchivIcon.dataset.noteId;
            // Hier kannst du die Funktion aufrufen, die auf das Aus-Archiv-Icon reagiert
            console.log("Aus Archiv geklickt für Notiz mit ID:", noteId);
            let ausArchiv = Model().ausArchiv(noteId);
            if (ausArchiv) {
                //console.log("SAVE TAG", tagnameValue);
                alert("Notiz wurde erfolgreich aus dem Archiv genommen!");
                // Ladet die Tag-Liste neu mit dem neuen Tag
                View().printList("archivierteNotizen");
            } else {
                alert("Notiz wurde nicht aus dem Archiv genommen!");
            }
        }
    }

    ///FORMS bei Klick auf "anlegen" ausgeben und Liste filtern
    handleFormClick(ev) {
        let btn = ev.target.closest("#addNoteBtn");
        if (btn) {
            //Das geklickte Element hat die ID "addNoteBtn"
            View().printForm();
        }

        btn = ev.target.closest("#addTagBtn");
        if (btn) {
            //Das geklickte Element hat die ID "addNTagBtn"
            View().printFormTag();
        }

        btn = ev.target.closest("#dropDown #aufsteigend");
        if (btn) {
            //Das geklickte Element hat die ID "dropDown aufsteigend"
            Model().orderList("aufsteigend");
            View().printList("notizen");
        }

        btn = ev.target.closest("#dropDown #absteigend ");
        if (btn) {
            //Das geklickte Element hat die ID "dropDown absteigend"
            Model().orderList("absteigend");
            View().printList("notizen");
        }
    }

    // save, change, delete Note / Tag
    handleSaveChangeDeleteClick(ev) {
        let btn = ev.target.closest("#saveNote");
        if (btn) {
            //Das geklickte Element hat die ID "saveNote"
            console.log("SAVE NOTE")
            let noteName = document.querySelector("#notename").value;
            let noteText = document.querySelector("#notetext").value;

            let priority ="";
            document.querySelectorAll('input[name="flexRadioDefault"]').forEach((radio) => {
                if (radio.checked) {
                    priority = radio.id.replace('prio', '');
                }
            });

            let tags = [];
            document.querySelectorAll('#newNote input[type="checkbox"]').forEach((checkbox) => {
                if (checkbox.checked) {
                    tags.push(checkbox.id);
                }
            });

            if(noteName === "" || noteText === "" || priority === ""){
                alert("Notiz kann nicht hinzugefügt werden! Notizenname, Notiz und Priorität dürfen nicht leer sein.");
            } else{
                let list = Model().getnoteList();
                let id = list.length+1;
                let name = noteName.toLocaleString();
                let text = noteText.toLocaleString();
                console.log(name, noteText, priority, tags);
                let date = new Date().toLocaleDateString();
                let note = new Note({id, name, text, date , priority, isactive: "true"});
                Model().addTagToNote(note, tags);
                Model().addNote(note);
                alert("Notiz wurde erfolgreich hinzugefügt!");
            }
        }

        btn = ev.target.closest("#changeNote");
        if (btn) {
            //Das geklickte Element hat die ID "changeNote"
            console.log("CHANGE NOTE")
            let h1Element = document.querySelector("#newNote h1");
            let noteId = h1Element.id;
            let status = Model().getStatusPage(noteId);

            let noteName = document.querySelector("#notename").value;
            let noteText = document.querySelector("#notetext").value;

            let priority;
            document.querySelectorAll('input[name="flexRadioDefault"]').forEach((radio) => {
                if (radio.checked) {
                    priority = radio.id.replace('prio', '');
                }
            });

            let tags = []
            document.querySelectorAll('#newNote input[type="checkbox"]').forEach((checkbox) => {
                if (checkbox.checked) {
                    tags.push(checkbox.id);
                }
            });

            if(noteName === "" || noteText === "" || priority === ""){
                alert("Notiz kann nicht geändert werden! Notizenname, Notiz oder Priorität darf nicht leer sein.");
            } else{
                let noteChanged = Model().changeNote(noteId, noteName, noteText, priority, tags);
                if (noteChanged) {
                    alert("Notiz erfolgreich geändert.");
                    // Ladet die Notiz-Liste neu ohne der gelöschten Notiz
                    View().printList(status);
                }
            }
            //console.log(noteName + " " + noteText + " " + priority + " " + tags);
        }

        btn = ev.target.closest("#deleteNote");
        if (btn) {
            //Das geklickte Element hat die ID "deleteNote"
            console.log("DELETE NOTE")
            let h1Element = document.querySelector("#newNote h1");
            let noteId = h1Element.id;
            let status = Model().getStatusPage(noteId);
            //console.log("Status " + noteId + " " + status);
            let noteDeleted = Model().deleteNote(noteId);
            if (noteDeleted) {
                alert("Notiz erfolgreich gelöscht.");
                // Ladet die Notiz-Liste neu ohne dem gelöschten Tag
                View().printList(status);
            }


        }

        //TAGS BEARBEITEN
        btn = ev.target.closest("#saveTag");
        if (btn) {
            //Das geklickte Element hat die ID "tagname"
            let tagnameValue = document.getElementById("tagname").value;
            console.log("SAVE TAG: " + tagnameValue);

            if (tagnameValue === ""){
                alert("Tag darf nicht leer sein!");
            } else {
                let tagAdded = Model().addTag(tagnameValue);
                if (tagAdded) {
                    //console.log("SAVE TAG", tagnameValue);
                    alert("Tag wurde erfolgreich hinzugefügt");
                    // Ladet die Tag-Liste neu mit dem neuen Tag
                    View().printList("tags");
                } else {
                    alert("Tag existiert bereits");
                }
            }
        }

        btn = ev.target.closest("#deleteTag");
        if (btn) {
            // Das geklickte Element hat die ID "deleteTag"
            let tagName = document.getElementById("tagname").value;
            //console.log("DELETE TAG", tagName);
            // Aufruf der deleteTag Methode im Model()
            let tagDeleted = Model().deleteTag(tagName);
            if (tagDeleted) {
                alert("Tag erfolgreich gelöscht.");
                // Ladet die Tag-Liste neu mit dem gelöschten Tag
                View().printList("tags");
            }
        }

        btn = ev.target.closest("#changeTag");
        if (btn) {
            //Das geklickte Element hat die ID "changeTag"
            let h2Element = document.querySelector('h2');
            let h2Id = h2Element.id;

            let tagName = document.getElementById("tagname").value;
            if (tagName === ""){
                alert("Tag darf nicht leer sein!");
            } else {
                let tagChanged = Model().changeTag(h2Id, tagName);
                if (tagChanged) {
                    alert("Tag erfolgreich geändert.");
                    // Ladet die Tag-Liste neu mit dem gelöschten Tag
                    View().printList("tags");
                }
            }
        }
    }
}

export function getInstance() {
    if(!controller) {
        controller = new Controller();
    }
    return controller;
}