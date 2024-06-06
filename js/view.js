
import {getInstance as Model} from "./model.js";

let view;

class View {
    constructor(){
        this.DOM = {
            nav: document.querySelector("ul.navbar-nav"),
            noteList: document.querySelector(".notelist"),
            tagList: document.querySelector(".taglist"),
            Form: document.querySelector("#header"),
            TagForm: document.querySelector("#addTagBtn"),
            SaveAndChangeAndDeleteTagAndNotes: document.getElementById("newNote")
        }
        document.querySelector("#newNote").replaceChildren();
        document.querySelector(".notelist").replaceChildren();
        document.querySelector(".taglist").replaceChildren();
    }

    //Holt alle DOM-Elemente
    getDOM() {
        return this.DOM;
    }

    //Hier wird die "Startseite" geladen
    addNote(note){
        this.printHeader("notizen");
        this.#printNote(note);
        this.printForm();
    }

    printHeader(navitemid){
        document.querySelector("#header").replaceChildren();
        //console.log(navitemid);
        let noteHtml;
        if(navitemid === "notizen") {
        noteHtml = `
            <div id="noteheader">
                <h1 class="mb-3 ">Meine Notizen</h1>
                <div class="row">
                    <div class="col-7">
                        <button type="button" id="addNoteBtn" class="btn btn-primary">Notiz anlegen</button>
                    </div>
                    <div id="dropDown" class="col-5 dropdown text-end">
                          <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <img class="icon" id="m-0 p-0" src="img/icons/filter.png" href="#">
                          </button>
                          <ul class="dropdown-menu">
                            <li><a id="aufsteigend" class="dropdown-item" href="#">Nach Priorität aufsteigend</a></li>
                            <li><a id="absteigend"  class="dropdown-item" href="#">Nach Priorität absteigend</a></li>
                          </ul>
                    </div>
                </div>
                <hr>
            </div>  `;
        }
        else if (navitemid === "archivierteNotizen"){
            noteHtml = `
            <div id="noteheader">
                <h1 class="mb-3 ">Meine archivierten Notizen</h1>
                <hr>
            </div>  `;
        }
        else if(navitemid === "tags"){
            noteHtml = `
            <div id="noteheader">
                <h1 class="mb-3 ">Meine Tags</h1>
                <button type="button" id="addTagBtn" class="btn btn-primary me-3">Tag anlegen</button>
                <hr>
            </div>  `;
        }
        document.querySelector("#header").insertAdjacentHTML("afterbegin",noteHtml);
    }

    #printNote(note) {
        let child = document.querySelector("#note_" + note.id);
        //console.log(child);
        if (child) {
            child.parentElement.removeChild(child);
        }
        if (note.isactive === "true") {
            //console.log(note)
            let noteHtml = `
                         <li id="node_${note.id}" class="list-group-item node-element">
                                <div class="card mb-3">
                                    <div class="card-body bg-light">
                                        <div class="row">
                                            <div class="col-10">
                                                <h5 class="card-title">${note.name}</h5>
                                            </div>
                                            <div class="col-2">
                                                <img class="icon insArchiv"  src="img/icons/insArchiv.png" href="#" data-note-id="${note.id}">
                                            </div>
             
                                        </div>
                                        <p class="card-text">${note.date}</p>
                                        <p class="card-text">${note.priority}</p>
                                    </div>
                                </div>
                        </li>`;
            document.querySelector(".list-group").insertAdjacentHTML("beforeend", noteHtml);
        }
    }

    printForm() {
        document.querySelector("#newNote").replaceChildren();
        let tagCheckboxes = '';
        //console.log(Model().tagList);
        // Erstellen von Checkboxen für jedes Tag in der Taglist
        Model().tagList.forEach(tag => {
            tagCheckboxes += `
              <input type="checkbox" class="form-check-input" id="${tag}">
              <label class="form-check-label" for="${tag}">${tag}</label>
              <br>`;

        });

            let noteHtml = `
            <h1 class="mb-3">Neue Notiz</h1>
            <div class="mb-3">
                <label for="notename" class="form-label">
                    <h2>Notizenname</h2>
                </label>
                <input type="text" class="form-control" id="notename">
            </div>
            <div class="mb-3">
                <label for="notetext" class="form-label">
                    <h2>Notiz</h2>
                </label>
                <textarea type="text" class="form-control" id="notetext" rows="3"></textarea>
            </div>
            <div>
                <h2>Priorität der Notiz</h2>
                   <div class="btn-group mb-3" role="group">
                        <div>
                        <input class="form-check-input me-1" type="radio" name="flexRadioDefault" id="prioHoch">
                        <label class="form-check-label me-3" for="prioHoch">
                            Hoch
                        </label>

                        <input class="form-check-input me-1" type="radio" name="flexRadioDefault" id="prioMittel">
                        <label class="form-check-label me-3" for="prioMittel">
                            Mittel
                        </label>

                        <input class="form-check-input me-1" type="radio" name="flexRadioDefault" id="prioNiedrig">
                        <label class="form-check-label me-3" for="prioNiedrig">
                            Niedrig
                        </label>
                    </div>
                    </div>
            </div>
            <div>
                <h2>Tag wählen</h2>
                <div class="mb-3 form-check">
                    ${tagCheckboxes}
                </div>
            </div>
            <button type="submit" id="saveNote" class="btn btn-primary">Notiz speichern</button>
        `;
            document.querySelector("#newNote").insertAdjacentHTML("afterbegin",noteHtml);
        }

    printNoForm() {
        document.querySelector("#newNote").replaceChildren();
    }

    printFormTag(){
        document.querySelector("#newNote").replaceChildren();
        let noteHtml = `
                <h1 class="mb-3">Neuer Tag</h1>
              <div class="mt-4 mb-3">
                <label for="tagname" class="form-label">
                    <h2>Tagname</h2>
                </label>
                <input type="text" class="form-control" id="tagname">
            </div>
            <button id="saveTag" type="button" class="btn btn-primary me-3">Tag speichern</button>
        `;
        document.querySelector("#newNote").insertAdjacentHTML("afterbegin",noteHtml);
    }

    printNoteDetail(note) {
        document.querySelector("#newNote").replaceChildren();

        let tagHtml = '';
        Model().tagList.forEach(tag => {
            const isChecked = note.tags.includes(tag); // Überprüfen, ob der Tag in der Notiz enthalten ist
            tagHtml += `
            <input type="checkbox" class="form-check-input" id="${tag}" ${isChecked ? 'checked' : ''}>
            <label class="form-check-label" for="${tag}">${tag}</label>
            <br>`;
        });

        let noteHtml = `    
        <h1 id="${note.id}" class="mb-3">Ihre Notiz</h1>
        <div class="mb-3">
            <label for="notename" class="form-label">
                <h2>Notizenname</h2>
            </label>
            <input type="text" class="form-control" id="notename" value="${note.name}">
        </div>
        <div class="mb-3">
            <label for="notetext" class="form-label">
                <h2>Notiz</h2>
            </label>
            <textarea type="text" class="form-control" id="notetext" rows="3">${note.text}</textarea>
        </div>
        <div>
            <h2>Priorität der Notiz</h2>
            <div class="btn-group mb-3" role="group">
                <div>
                    <input class="form-check-input me-1" type="radio" name="flexRadioDefault" id="prioHoch" ${note.priority === "Hoch" ? 'checked' : ''}>
                    <label class="form-check-label me-3" for="prioHoch">
                        Hoch
                    </label>

                    <input class="form-check-input me-1" type="radio" name="flexRadioDefault" id="prioMittel" ${note.priority === "Mittel" ? 'checked' : ''}>
                    <label class="form-check-label me-3" for="prioMittel">
                        Mittel
                    </label>

                    <input class="form-check-input me-1" type="radio" name="flexRadioDefault" id="prioNiedrig" ${note.priority === "Niedrig" ? 'checked' : ''}>
                    <label class="form-check-label me-3" for="prioNiedrig">
                        Niedrig
                    </label>
                </div>
            </div>
        </div>
        <div>
            <h2 >Tag wählen</h2>
            <div class="mb-3 form-check">
                ${tagHtml}
            </div>
        </div>
        <button type="submit" id="changeNote" class="btn btn-primary me-3">Änderungen speichern</button>
        <button type="submit" id="deleteNote" class="btn btn-primary">Notiz löschen</button>`;
        document.querySelector("#newNote").insertAdjacentHTML("afterbegin", noteHtml);
    }

    printTagDetail(tag){
        document.querySelector("#newNote").replaceChildren();
        let noteHtml =`
            <h1 id="${tag}" class="mb-3">Ihr Tag</h1>
            <div class="mt-4 mb-3">
                <label for="tagname" class="form-label">
                    <h2 id="${tag}">Tagname</h2>
                </label>
                <input type="text" class="form-control" id="tagname" value="${tag}">
            </div>
            <button id="changeTag" type="button" class="btn btn-primary me-3">Änderungen speichern</button>
            <button id="deleteTag" type="button" class="btn btn-primary me-3">Tag löschen</button>
             `;
        document.querySelector("#newNote").insertAdjacentHTML("afterbegin", noteHtml);
    }

    printList(navitemid){
        document.querySelector(".notelist").replaceChildren();
        document.querySelector(".taglist").replaceChildren();
        let noteHtml;
        if (navitemid === "notizen") {
            let noteList = Model().getnoteList();
            this.printForm();
            for (let note of noteList) {
                if (note.isactive === "true") {
                    //console.log(note)
                    noteHtml = `
                         <li id="node_${note.id}" class="list-group-item node-element">
                                <div class="card mb-3">
                                    <div class="card-body bg-light">
                                        <div class="row">
                                            <div class="col-10">
                                                <h5 class="card-title">${note.name}</h5>
                                            </div>
                                            <div class="col-2">
                                                <img class="icon insArchiv"  src="img/icons/insArchiv.png" href="#" data-note-id="${note.id}">
                                            </div>
             
                                        </div>
                                        <p class="card-text">${note.date}</p>
                                        <p class="card-text">${note.priority}</p>
                                    </div>
                                </div>
                        </li>`;
                    document.querySelector(".notelist").insertAdjacentHTML("afterbegin", noteHtml);
                }
            }
        } else if (navitemid === "archivierteNotizen") {
            let noteList = Model().getnoteList();
            this.printNoForm();
            for (let note of noteList) {
                if (note.isactive === "false") {
                    //console.log(note)
                    noteHtml = `
                         <li id="node_${note.id}" class="list-group-item node-element">
                                <div class="card mb-3">
                                    <div class="card-body bg-light">
                                        <div class="row">
                                            <div class="col-10">
                                                <h5 class="card-title">${note.name}</h5>
                                            </div>
                                            <div class="col-2">
                                                <img class="icon ausArchiv"  src="img/icons/ausArchiv.png" href="#" data-note-id="${note.id}">
                                            </div>
             
                                        </div>
                                        <p class="card-text">${note.date}</p>
                                        <p class="card-text">${note.priority}</p>
                                    </div>
                                </div>
                        </li>`;
                    document.querySelector(".notelist").insertAdjacentHTML("afterbegin", noteHtml);
                }
            }
        } else if (navitemid === "tags") {
            const tagList = Model().tagList;
            this.printFormTag()
            for (let tag of tagList) {
                noteHtml=`
                    <li id="${tag}" class="list-group-item tag-element">
                        <div class="card mb-3">
                            <div class="card-body bg-light">
                                <div class="row">
                                        <h5 class="card-title">${tag}</h5>
                                </div>
                            </div>
                        </div>
                    </li>`
            document.querySelector(".taglist").insertAdjacentHTML("afterbegin", noteHtml);
            }
        }

    }

}

export function getInstance() {
    if(!view) {
        view = new View();
    }
    return view;
}

