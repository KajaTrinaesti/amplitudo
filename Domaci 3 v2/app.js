const api = '83763799'
let imenaPrveKolone = ['Naslov', 'Godina', 'Datum objavljivanja', 'Trajanje', 'Reziser', 'Glumci', 'Radnja', 'Broj sezona']
let imenaDrugeKolone = ['Title', 'Year', 'Released', 'Runtime', 'Director', 'Actors', 'Genre', 'totalSeasons']
let pageNumbers



$(document).ready(() => {
    $('#pretraga').on('click', () => {
        postaviStranicu(1)
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


function prikaziDetalje(rowID, faIndex) {
    console.log(rowID)
    let rowEl = $('#' + rowID)
    let faChange = $('#toggleFA-' + faIndex)
    let rez = ''


    if(faChange.hasClass('fa-plus')) {
        faChange.removeClass('fa-plus')
        faChange.addClass('fa-minus')
    } else {
        faChange.removeClass('fa-minus')
        faChange.addClass('fa-plus')
    }

    if(rowEl.hasClass('clicked')) {
        rowEl.toggleClass('skriveno')
    } else {
        $.get(`http://www.omdbapi.com/?apikey=${api}&i=${rowID}`, (data, status) => {
            console.log(status, data)

            imenaPrveKolone.forEach((el, index) => {
                if(el === 'Broj sezona' && $('#filmovi').val() === 'movie') {
                    
                } else {
                    rez += `<tr><td>${el}:</td><td>${data[imenaDrugeKolone[index]]}</td></tr>`
                }
            })

            if(data?.Ratings?.length) {
                rez += `<tr><td>Ocene gledalaca:</td><td>${data.Ratings[0].Source}: ${data.Ratings[0].Value}</td></tr>`
    
                data.Ratings.forEach((el, index) => {
                    if(index !== 0) {
                        rez += `<tr><td></td><td>${el.Source}: ${el.Value}</td></tr>`
                    }
                })
            }


            rowEl.html(`
                <td class="innerINFO" colspan="3">
                    <img src="${data.Poster}" />
                    <div class="info">
                        <table>
                            <tbody class="innerTable">
                                ${rez}
                            </tbody>
                        </table>
                    </div>
                </td>
            `)
            rowEl.addClass('clicked')
            rowEl.removeClass('skriveno')

        })
    }
}


function postaviBrojeveStranica(broj, aktivna) {
    let output = ''
    let brojPrikazanihStranica = 3

    // console.log(broj + '\n', aktivna, brojPrikazanihStranica)


    if(brojPrikazanihStranica >= broj) {
        for(let i = 1; i <= broj; i++) {
            if(i === aktivna) {
                output += `<a class="active" onclick="postaviStranicu(${i})">${i}</a>`
            } else {
                output += `<a onclick="postaviStranicu(${i})">${i}</a>`
            }
        }
    } else if(broj <= aktivna + brojPrikazanihStranica) {
        output += `<a onclick="postaviStranicu(1)">1</a>`

        output += `<span> . . . . . . </span>`

        for(let i = (aktivna - 1 > broj - brojPrikazanihStranica ? (aktivna - brojPrikazanihStranica + 1) : aktivna - 1); i <= broj; i++) {
            if(i === aktivna) {
                output += `<a class="active" onclick="postaviStranicu(${i})">${i}</a>`
            } else {
                output += `<a onclick="postaviStranicu(${i})">${i}</a>`
            }
        }
    } else {
        for(let i = (aktivna === 1 ? aktivna : aktivna - 1); i < aktivna + brojPrikazanihStranica; i++) {
            if(i === aktivna) {
                output += `<a class="active" onclick="postaviStranicu(${i})">${i}</a>`
            } else {
                output += `<a onclick="postaviStranicu(${i})">${i}</a>`
            }
        }
        output += `<span> . . . . . . </span>`
        if(broj === aktivna) {
            output += `<a class="active" onclick="postaviStranicu(${broj})">${broj}</a>`
        } else {
            output += `<a onclick="postaviStranicu(${broj})">${broj}</a>`
        }
    }

    

    $('#brojStranice').html(output)
}


function postaviStranicu(brojStranice) {
        let naslov = $('#naslov')
        let film = $('#filmovi')
        let godina = $('#godina')

        // Ne dodajem ovo u thead jer mi ljepse ovako nekako xD
        let zaRez = '<tr style="font-weight: 600;"><td>Ime filma/serije</td><td>Godina</td><td></td></tr>'
        


        
        
        $.get(`http://www.omdbapi.com/?apikey=${api}&page=${brojStranice}&s=${naslov.val()}&type=${film.val()}&y=${godina.val()}&r=json`, (data, status) => {
            // console.log(data, 'DDDDDD')

            if(status === 'success' && !data?.Error) {
                if(!checkValidity(naslov, godina)) {
                    return 0
                }
                
                if(brojStranice === 1 || !pageNumbers) {
                    pageNumbers = Math.ceil(data?.totalResults / data?.Search.length)
                }
    
                // console.log(data.totalResults, data.Search.length)
                postaviBrojeveStranica(pageNumbers, brojStranice)
                if(data.Response === "True") {
                    data.Search.forEach((el, index) => {
                        
                        zaRez += `<tr onclick="prikaziDetalje('${el.imdbID}', ${index})" class="cursorPointer"><td>${el.Title}</td><td>${el.Year}</td><td><i id="toggleFA-${index}" class="fa fa-plus"></i></td></tr><tr id="${el.imdbID}" class="skriveno"></tr>`
                    })
                }
    
                $('#rezultatiPretrage').removeClass('skriveno')
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
}