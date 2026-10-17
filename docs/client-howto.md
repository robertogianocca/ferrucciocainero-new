# Guida rapida — modifica contenuti (Ferruccio Cainero)

Indirizzo editor: **`https://ferrucciocainero.ch/admin`**  
(in locale: `http://localhost:3000/admin`)

Accedi con l’account Google/email invitati su Sanity.

## Menu laterale

- **Calendar** → eventi e tipi evento  
- **Blog** → articoli (Attualità)  
- **Pages** → testi delle pagine del sito  
- **Settings** → menu, footer, email/telefono  

## Aggiungere un evento

1. Apri **Calendar → Events → Create**
2. Compila titolo, data/ora inizio (obbligatori)
3. Opzionale: fine, luogo, città, link biglietti, descrizione
4. **Publish**

L’evento compare in `/calendario` dopo pochi secondi (quando il webhook è attivo in produzione).

## Scrivere un articolo

1. **Blog → Create**
2. Titolo, slug (Generate), data, estratto, testo
3. **Publish** → visibile in `/blog`

## Modificare il testo di una pagina

1. **Pages** → scegli la pagina (es. BIO, TEATRO)
2. Modifica il corpo (testo, immagini, galleria, video)
3. **Publish**

## Anteprima (Presentation)

Nel menu Studio c’è lo strumento **Presentation**: apre un’anteprima del sito collegata all’editor. Utile per controllare prima di pubblicare.

## Contatto

La pagina Contact mostra i dati di testo. Il form email verrà aggiunto in un secondo momento.

## Aiuto

Per problemi tecnici contatta lo sviluppatore del sito.
