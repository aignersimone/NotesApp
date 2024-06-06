// Die Klasse "Note" repräsentiert eine Notiz mit verschiedenen Eigenschaften
export default class Note {
    // Private Eigenschaften
    #id;
    #name;
    #text;
    #date;
    #priority;
    #isactive;
    #tags;

    // Konstruktor für die Erstellung einer neuen Notiz-Instanz
    constructor({id, name, text, date, priority, isactive}) {
        this.#id = id;
        this.#name = name;
        this.#text = text;
        this.#date = date;
        this.#priority = priority;
        this.#isactive = isactive;
        this.#tags = [];
    }

    // Getters und Setters definieren
    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    setName(newName) {
        this.#name = newName;
    }

    get text() {
        return this.#text;
    }

    setText(newText) {
        this.#text = newText;
    }

    get date() {
        return this.#date;
    }

    setDate(newDate) {
        this.#date = newDate;
    }

    get priority() {
        return this.#priority;
    }

    setPriority(newPriority) {
        this.#priority = newPriority;
    }

    get isactive(){
        return this.#isactive;
    }

    set isActive(value) {
        this.#isactive = value;
    }

    get tags() {
        return this.#tags;
    }

    setTags(newTags) {
        this.#tags = newTags;
    }

    // Methode zum Hinzufügen eines Tags in das Array der Notizentags
    addTag(tag){
        this.#tags.push(tag);
    }

}