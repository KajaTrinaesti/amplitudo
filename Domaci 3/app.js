$(document).ready(() => {
    const api = '83763799'

    $('#pretraga').on('click', () => {
        let naslov = $('#naslov')
        let film = $('#filmovi')
        let godina = $('#godina')
        let zaRez = ''
        let imenaPrveKolone = ['Naslov', 'Godina', 'Datum objavljivanja', 'Trajanje', 'Reziser', 'Glumci', 'Radnja', 'Broj sezona']
        let imenaDrugeKolone = ['Title', 'Year', 'Released', 'Runtime', 'Director', 'Actors', 'Genre', 'totalSeasons']

        
        $.get(`http://www.omdbapi.com/?apikey=${api}&t=${naslov.val()}&type=${film.val()}&y=${godina.val()}&r=json`, (data, status) => {
            
            if(status === 'success' && !data?.Error) {
                if(!checkValidity(naslov, godina)) {
                    return 0
                }
                
                $('#rezultatiPretrage').removeClass('skriveno')
                $('#greska').html('')
                

                imenaPrveKolone.forEach((el, index) => {
                    if(el === 'Broj sezona' && film.val() === 'movie') {
                        
                    } else {
                        zaRez += `<tr><td>${el}</td><td>${data[imenaDrugeKolone[index]]}</td></tr>`
                    }
                })

                zaRez += `<tr><td>Ocene gledalaca:</td><td>${data.Ratings[0].Source}: ${data.Ratings[0].Value}</td></tr>`

                data.Ratings.forEach((el, index) => {
                    if(index !== 0) {
                        zaRez += `<tr><td></td><td>${el.Source}: ${el.Value}</td></tr>`
                    }
                })


                $('#slika').attr('src', data.Poster)

                $('tbody').html(zaRez)

                return 1
            }

            if(status === 'success' && data?.Error) {
                $('#greska').html(`<p>${data.Error}</p>`)
                return 0
            }

            if(status !== 'success') {
                $('#greska').html('<p>Doslo je do greske</p>')

                return 0
            }

        })

    })
})


function checkValidity(naslov, godina) {
    if(!naslov.val()) {
        naslov.css('border', '2px solid red')
        return 0
    }

    if(godina.val()) {
        godina.val().split('').forEach(el => {
            if(!'0123456789'.includes(el)) return 0
        })
    }

    return 1
}