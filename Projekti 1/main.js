const addButton = document.getElementById('addToDo'); 
const taskInput = document.getElementById('inputField');
const taskList = document.getElementById('todo-list');


function addTask(event) {
    
    event.preventDefault() // Estetään uudelleen lähetyksen, jotta käyttäjä ehtii reagoimaan virheisiin

    const task = taskInput.value; 

    // Tyhjien, liian lyhyiden ja liian pitkien syötteiden tarkistus
    if (task === "") {
        alert('Syöttökenttä ei voi olla tyhjä');
        taskInput.classList.add('alert')
    } else if (task.length < 3) { // Tarkistetaan, että syöte on vähintään 3 merkkiä pitkä
        alert('Tehtävän tulee olla vähintään 3 merkkiä pitkä');
        taskInput.classList.add('alert')
    } else if (task.length > 47) { // Tarkistetaan, että onko syöte yli 47 merkkiä
        alert('Merkkiraja ylitetty'); 
        taskInput.classList.add('alert')
    } else {
        createTaskElement(task); // Kutsutaan funktiota, joka luo uuden tehtävän
        tallennaLocalstorageen(); // Tallennetaan localstoreen
        taskInput.value = ''; // Tyhjennetään syöttykenttä 
        taskInput.classList.remove('alert') // Punainen reunus pois
    }
}

addButton.addEventListener('click', addTask);


// Luodaan uusi elementti eli tehtävä
function createTaskElement(task, completed = false) {
    const listItem = document.createElement('li'); // Luodaan lista elementti
    taskList.appendChild(listItem); 

    // Luodaan listaelementtiin checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = completed; // Asetetaan checkbox vastaamaan suoritustilaa

    // Lisätään tapahtumakuuntelija checkboxille
    checkbox.addEventListener('change', function() {
        const taskTextElement = listItem.querySelector('.task-text');
        if (checkbox.checked) {
            taskTextElement.classList.add('completed'); // Merkitään tehtävä hoidetuksi
        } else {
            taskTextElement.classList.remove('completed'); // Poistetaan merkintä ja palautetaan keskeneräiseksi
        }
        tallennaLocalstorageen(); // Tallenna tehtävät jokaisen checkbox-muutoksen jälkeen
    });

    // Lisätään checkbox listaelementtiin
    listItem.appendChild(checkbox); 

    // Luodaan span elementti tehtävätekstiä varten
    const taskText = document.createElement('span');
    taskText.className = 'task-text'; // Lisätään luokka, jota käytetään yliviivaamiseen
    taskText.textContent = task; // Asetetaan tehtäväteksti
        
    listItem.appendChild(taskText); // Lisätään tehtäväteksti listaelementtiin

    // Jos tehtävä on merkitty valmiiksi, lisätään myös 'completed'-luokka
    if (completed) {
        taskText.classList.add('completed');
    }

    // Luodaan poista-painike
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'poista';
    deleteButton.className = 'deleteTask';

    listItem.appendChild(deleteButton); // Lisätään poista-painike listaelementtiin
    
    deleteButton.addEventListener('click', function() {
        taskList.removeChild(listItem); // Poistetaan listaelementti
        tallennaLocalstorageen(); // Tallenna tehtävät uudelleen poiston jälkeen
    });
}



function FiltteroidaanTehtavat() {
    const valitse = document.querySelector('.filter-tasks').value; // Hae valittu suodatusarvo
    const checkboxit = taskList.querySelectorAll('.task-checkbox'); // Hae kaikki checkbox-elementit
    

    checkboxit.forEach(function(checkbox) {
        const tehtava = checkbox.closest('li'); // Hakee lähimmän <li> elementin
        
        // Suodatetaan tehtävät valinnan mukaan
        if (valitse === 'suoritettu') {  // Jos käyttäjä valitsee suoritettu
      
            let displayValue; // Määritetään DisplayValue muuttuja

            if (checkbox.checked) {
                displayValue = 'flex';  // jos tehtävä on suoritettu, se asetetaan näkyväksi
            } else {
                displayValue = 'none'; // Muuten piilotetaan
            }

            tehtava.style.display = displayValue; 
        } else if (valitse === 'kesken') { // Jos käyttäjä valitsee kesken
          
            let displayValue; 

            if (checkbox.checked === false) { // Jos ei ole suoritettu, asetetaan näkyväksi
                displayValue = 'flex'; 
            } else {
                displayValue = 'none'; // Muuten piilotetaan
            }

            tehtava.style.display = displayValue; // Asettaa tehtävän näkyväksi tai piilotetuksi
        } else {
            tehtava.style.display = 'flex'; // Jos kumpaakaan ei ole valittu, niin kaikki näytetään 
        }
    });
}


const filterSelect = document.querySelector('.filter-tasks'); // Hae select-elementti
filterSelect.addEventListener('change', FiltteroidaanTehtavat); // Lisää tapahtumakuuntelija


function tallennaLocalstorageen() {
    let tehtavat = []; // Tyhjä taulukko 
    const listanElementit = taskList.querySelectorAll('li'); // Hae kaikki listan elementit

    listanElementit.forEach(function(item) { 
        // Käytetään getElementsByClassNamea, mutta valitaan ensimmäinen elementti [0]
        const taskText = item.getElementsByClassName('task-text')[0].textContent; // Hae ensimmäinen .task-text-luokan elementti
        const isChecked = item.getElementsByClassName('task-checkbox')[0].checked; // Hae ensimmäinen .task-checkbox-luokan checkbox
        tehtavat.push({ text: taskText, completed: isChecked }); // Tallenna sekä teksti että valmis-tila
    });

    // Tallennetaan tehtävät localStorageen JSON-muodossa
    localStorage.setItem('tasks', JSON.stringify(tehtavat)); 
}

function tuodaanLocalStoragesta() { 
    const tallennetutTehtavat = JSON.parse(localStorage.getItem('tasks')); // JSON.parse muuttaa käyttökelpoiseksi javascriptissä
    
    if (tallennetutTehtavat) { // Tarkistetaan onko tallennettuja tehtäviä
        tallennetutTehtavat.forEach(function(task) {
            createTaskElement(task.text, task.completed); // Lataa tallennetut tehtävät kutsumalla cretaeTaskElement funktiota
        });
    }
}

tuodaanLocalStoragesta()








