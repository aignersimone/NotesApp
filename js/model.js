import Subject from './subject.js';
import Note from './note.js'

let noteModel;

class NoteModel extends Subject {
    #noteList;
    #tagList;
    #userId;

    constructor() {
        super();
        this.#noteList = [];
        this.#tagList = [];
        this.#userId = undefined;
        this.#loadFromJSON();
    }

    getnoteList() {
        return this.#noteList;
    }

    get tagList() {
        return this.#tagList;
    }

    addNote(note) {
        this.#noteList.push(note);
        this.notifyObservers("addNote", note);
    }

    getNoteById(noteId) {
        return this.#noteList.find(note => note.id === noteId);
    }

    #loadFromJSON() {
        fetch("json/note.json").then((response) => {
            console.log(response);
            return response.json();
        }).then(data => {
            this.#userId = data.userId;
            for (let note of data.notes) {
                let presentnote = new Note(note);
                let tags = [];
                for (let tagData of note.tags) {
                    let tagName = tagData.name;
                    tags.push(tagName);
                }
                this.addTagToNote(presentnote, tags);
                this.addNote(presentnote);
            }
        });
    }

    addTagToNote(note, tags) {
        //Alle Tags des Arrays der Note der JSON-File durchlaufen
        for (let i = 0; i < tags.length; i++) {
            let tagName = tags[i];
            //Tag zur Taglist hinzufügen
            let answer = this.addTag(tagName);
            console.log(answer);
            // Hinzufügen des Tags zur Notiz
            note.addTag(tagName);
        }
    }

    addTag(tagName) {
        // Prüfen, ob der Tag bereits in der zentralen #tagList existiert, wenn ja return true
        for (let i = 0; i < this.#tagList.length; i++) {
            if(this.#tagList[i] == tagName){
                return false;
            }
        }
        this.#tagList.push(tagName);
        return true;
        //console.log(this.#tagList)
    }

    deleteTag(tagName) {
        // überprüft, ob es in der Liste von Notizen (this.#noteList) mindestens eine
        // Notiz gibt, die den angegebenen Tag (tagName) enthält
        let tagInUse = this.#noteList.some(note => note.tags.includes(tagName));

        if (tagInUse) {
            alert("Tag kann nicht gelöscht werden, da er in einer Notiz verwendet wird.");
            return false; // Tag wurde nicht gelöscht
        } else {
            // Bestätigungsdialog anzeigen
            let confirmation = window.confirm("Sind Sie sicher, dass Sie den Tag löschen möchten?");

            if (confirmation) {
                let tagIndex = this.#tagList.indexOf(tagName);
                if (tagIndex !== -1) {
                    this.#tagList.splice(tagIndex, 1);
                    return true; // Tag erfolgreich gelöscht
                }
                return false; // Tag wurde nicht gefunden
            } else {
                return false; // Benutzer hat "Abbrechen" geklickt
            }
        }
    }

    changeTag(oldTagName, newTagName) {
        let tagInUse = this.#noteList.some(note => note.tags.includes(oldTagName));

        if (tagInUse) {
            alert("Tag kann nicht geändert werden, da er in einer Notiz verwendet wird.");
            return false; // Tag wurde nicht geändert
        } else {
            // Durchlaufen der #tagList
            for (let i = 0; i < this.#tagList.length; i++) {
                // Vergleich des aktuellen Tags mit dem alten Tag
                if (this.#tagList[i] === oldTagName) {
                    // Das alte Tag wurde gefunden, aktualisiere es mit dem neuen Wert
                    this.#tagList[i] = newTagName;
                    return true; // Tag erfolgreich gelöscht
                }

            }

        }
    }

    insArchiv(noteId){
        let confirmation = window.confirm("Sind Sie sicher, dass Sie die Notiz archivieren möchten?");
        if (confirmation) {
            for (let i = 0; i < this.#noteList.length; i++) {
                //console.log(this.#noteList[i].id);
                //console.log(noteId);
                if (this.#noteList[i].id == noteId) {
                    // Note in der noteList gefunden, setze isActive auf false
                    this.#noteList[i].isActive = "false";
                    return true; // Erfolgreich archiviert
                }
            }
        }
        return false;
    }

    ausArchiv(noteId){
        let confirmation = window.confirm("Sind Sie sicher, dass Sie die Notiz aus dem Archiv nehmen möchten?");
        if (confirmation) {
            for (let i = 0; i < this.#noteList.length; i++) {
                //console.log(this.#noteList[i].id);
                //console.log(noteId);
                if (this.#noteList[i].id == noteId) {
                    // Note in der noteList gefunden, setze isActive auf false
                    this.#noteList[i].isActive = "true";
                    return true; // Erfolgreich archiviert
                }
            }
        }
        return false;
    }

    getStatusPage(noteId){
        for (let i = 0; i < this.#noteList.length; i++) {
            if (this.#noteList[i].id == noteId) {
                if(this.#noteList[i].isactive == "true"){
                    return "notizen";
                }
                else  {
                    return "archivierteNotizen";
                }
            }
        }
    }

    deleteNote(noteId){
        let confirmation = window.confirm("Sind Sie sicher, dass Sie die Notiz löschen möchten?");
        if (confirmation) {
            for (let i = 0; i < this.#noteList.length; i++) {
                //console.log(this.#noteList[i].id);
                //console.log(noteId);
                if (this.#noteList[i].id == noteId) {
                    // Notiz aus dem Array entfernen
                    this.#noteList.splice(i, 1);
                    return true; // Erfolgreich gelöscht
                }
            }
        }
        return false;
    }

    changeNote(noteId, newName, newText, newPriority, newTags) {
        for (let i = 0; i < this.#noteList.length; i++) {
            if (this.#noteList[i].id == noteId) {
                // Update aller Note Bestandteile
                this.#noteList[i].setName(newName);
                this.#noteList[i].setText(newText);
                this.#noteList[i].setPriority(newPriority);
                this.#noteList[i].setTags(newTags);

                // Updaten der Zeit
                this.#noteList[i].setDate(new Date().toLocaleDateString());

                // Return true, da die Notiz geändert wurde
                return true;
            }
        }

        // Return false, wenn keine Notiz gefunden wurde
        return false;
    }

    orderList(type) {
        let helperList = [];
        let highList = [];
        let middleList = [];
        let lowList = [];
        for (let i = 0; i < this.#noteList.length; i++) {
            if(this.#noteList[i].priority == "Hoch"){
                highList.push(this.#noteList[i]);
                console.log(highList);
            }
            if(this.#noteList[i].priority == "Mittel"){
                middleList.push(this.#noteList[i]);
                console.log(middleList);
            }
            if(this.#noteList[i].priority == "Niedrig"){
                lowList.push(this.#noteList[i]);
                console.log(lowList);
            }
        }

        if (type == "aufsteigend") {
            helperList = highList.concat(middleList, lowList);
        } else if (type == "absteigend") {
            helperList = lowList.concat(middleList, highList);
        }

        this.#noteList = helperList;
        console.log(this.#noteList);
    }
}

export function getInstance() {
    if(!noteModel) {
        noteModel = new NoteModel();
    }
    return noteModel;
}
