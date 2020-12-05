// niz objekata od kojih svaki predstavlja jedno pitanje
// u realnoj aplikaciji, dobili bi ga u JSON formatu (AJAX pozivom ka serveru)
const pitanja = [
    {
      // tekst pitanja
      pitanje: "Ko je osnivač kompanije <em>Apple</em>?", 
      // ponudjeni odgovori
      odgovori: {
        a: "Bil Gejts",
        b: "Ilon Maks",
        c: "Stiv Džobs"
      },
      // koji on ponudjenih odgovora je tacan
      tacanOdgovor: "c"
    },
    {
      pitanje: "Kako se zvala prva programerka? Jedan progamski jezik nosi njeno ime.",
      odgovori: {
        a: "Ada Bajron",
        b: "Karmen Elektra",
        c: "Java Script"
      },
      tacanOdgovor: "a"
    },
    {
      pitanje: "Ko je osnovao Facebook?",
      odgovori: {
        a: "Nikola Tesla",
        b: "Mark Zuckerberg",
        c: "Bill Gates"
      },
      tacanOdgovor: "b"
    },
    {
      pitanje: "Ko je najbogatiji covek na svijetu?",
      odgovori: {
        a: "Bill Gates",
        b: "Elon Musk",
        c: "Jeff Bezos"
      },
      tacanOdgovor: "c"
    },
    {
      pitanje: "Kako se zove petlja unutar petlje u programiranju?",
      odgovori: {
        a: "Varijabla",
        b: "Nested loop/Ugnijezdjena petlja",
        c: "To ne postoji"
      },
      tacanOdgovor: "b"
    },
    {
      pitanje: "Kako se zove čuveni naučnik o kome govori film <em>The Immitation Game</em> ",
      odgovori: {
        a: "Nikola Tesla",
        b: "Alen Tjuring",
        c: "Tomas Edison"
      },
      tacanOdgovor: "b"
    }
];

// Vrijeme koliko traje kviz (u sekundama)
let secs = 60

const kvizDiv = document.getElementById('kviz'); // div za prikaz pitanja i ponudjenih odgovora
const rezultatDiv = document.getElementById('rezultat'); // div za prikaz rezultata
const zavrsiBtn = document.getElementById('zavrsi'); // dugme za zavrsavanje kviza

// metod koji se poziva da bi se prikazala pitanja i ponudjeni odgovori
function pokreniKviz(){
  // niz koji popunjavamo tekstom pitanja i ponudjenim odgovorima
  // niz ce sadrzati HTML elemente
  const output = [];

  // prolazimo petljom kroz sve elemente niza pitanja
  // uzimamo pitanje koje je aktuelno u trenutnoj iteraciji i njegov indeks
  pitanja.forEach(function(trenutnoPitanje, pitanjeInd){
    // niz koji cemo popuniti odgovorima na trenutno pitanje
    const odgovori = []; 
    // petlja koja prolazi svim odgovorima trenutnog pitanja
    for(slovo in trenutnoPitanje.odgovori){
      // u niz odgovora dodajemo HTML kod za prikaz ponudjenog odgovora
      // inputi za odgovor na isto pitanje moraju imati isti name atribut
      // odradjujemo da svaki od njih ima name="odogovor"+indeks_trenutnog_pitanja
      // na taj nacin ce svi ponudjeni odgovori na pitanje sa indeksom 1 imati name="odgovor1"
      // vrijednost odgovora je upravo ono slovo pod kojim je on i ponudjen
      // tekst je oblika: " a : tekst_odgovora "
      odgovori.push(
        `<label>
          <input type="radio" name="odgovor${pitanjeInd}" value="${slovo}" >
          ${slovo} : ${trenutnoPitanje.odgovori[slovo]}
          </label>`
      );
    }

    // na kraju u output niz koji sadrzi sva pitanja i ponudjene odgovore dodajemo trenutno
    // trenutnoPitanje.pitanje je tekst pitanja
    // funkcija join od niza pravi string
    output.push(
      `
        <div class="pitanje" id="${pitanjeInd}">${trenutnoPitanje.pitanje}</div>
        <div class="odgovori"> ${odgovori.join('')} </div>
      `
    );

  });
  // na kraju popunjavamo div za prikaz pitanja i odgovora
  kvizDiv.innerHTML = output.join('');
  tajmer()
}

// funkcija koja se poziva na klik dugmeta za zavrsavanje kviza
// provjerava koliko je igrac imao tacnih odgovora
function prikaziRezultat(){
  

  // na samom pocetku nije imao tacnih odgovora
  let brTacnih = 0;

  // prolazimo kroz globalni niz svih pitanja
  // tu poredimo odgovor koji je igrac dao na to pitanja sa tacnim odgovorom pitanja 
  pitanja.forEach(function(trenutnoPitanje, pitanjeInd){
    // selektor koji trazi cekirani input na trenutno pitanje
    const selektor = `input[name=odgovor${pitanjeInd}]:checked`;
    // igrac je odgovorio ono sto je vrijednost cekiranog input-a (radio button-a)
    const odgovoreno = (document.querySelector(selektor) || {} ).value;

    // ako je ono sto je igrac odgovorio jednako tacnom odgovoru na trenutno pitanje
    // to znaci da je igrac tacno odgovorio i povecavamo ukupan broj tacnih odgovora
    if(odgovoreno === trenutnoPitanje.tacanOdgovor){
      brTacnih++;
      document.getElementById(pitanjeInd).classList.add('tacno')
    } else {
      document.getElementById(pitanjeInd).classList.add('netacno')
    }
  });
  // na kraju samo popunjavamo div za prikaz rezultata
  rezultatDiv.innerHTML = `Rezultat: <h3>${brTacnih} od ${pitanja.length}</h3>`;

  prekiniTajmer()
}


function tajmer(tajmerID = document.getElementById('tajmer')) {
  if(!secs) {
    prikaziRezultat()
    tajmerID.innerHTML = ''
    return 0
  }

  // Mijenja se boja fonta u crvenu ako je preostalo 10 <= sekundi
  if(secs === 10) tajmerID.classList.add('netacno')

  tajmerID.innerHTML = `Preostalo Vam je jos ${secs}s`
  
  setTimeout(() => {
    if(secs) {
      --secs
      tajmer()
    }
  }, 1000)
}

function prekiniTajmer(tajmerID = document.getElementById('tajmer')) {
  secs = 0
  tajmerID.innerHTML = ''
}


// na ucitavanje stranice, pozivamo metod za prikaz(pocetak) kviza
pokreniKviz();
// na dugme za zavrsavanje dodajemo listener koji na klik pokrece kraj kviz i racuna ucinak
zavrsiBtn.addEventListener('click', prikaziRezultat);


/* DOMACI ZADATAK 2 */
// 1. tekst pitanja dobija crvenu(ako je korisnik odgovorio netacno) 
// ili zelenu (ako je korisnik odgovorio tacno) boju
// 2. postaviti tajmer da se automatski zavrsi kviz nakon 60 sekundi






// Nesto ja izvodio hahah :D
function darkMode() {
  document.querySelector('body').classList.toggle('body')
  document.getElementById('kviz').classList.toggle('kvizz')
}

document.getElementById('darkMode').addEventListener('click', darkMode)