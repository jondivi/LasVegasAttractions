const deleteBtn = document.querySelectorAll('.del')
const attractionItem = document.querySelectorAll('span.not')
const attractionComplete = document.querySelectorAll('span.completed')
const listTab = document.querySelectorAll('li.btn')
const h1 = document.querySelector('h1')
const lists = document.querySelectorAll('ul.list')
//'myListBtn' 'gamblingBtn' 'entertainBtn' 'familyBtn' 'diningBtn'
Array.from(listTab).forEach((el)=>{
    el.addEventListener('click', changeTabs)
})
function changeTabs(){
  this.style.display = 'none';
  h1.innerText = this.innerText;
  
  Array.from(listTab).forEach(x => {
    if (x.innerText != this.innerText){
      x.style.display = 'inline';
      // console.log(x.innerText);
    }
  })

  if (this.innerText === 'My List'){
      document.querySelector('ul.customL').style.display = 'flex';
      Array.from(lists).forEach(x => {
        if(x.className !== 'customL list'){ x.style.display = 'none'}
      })
    } else if (this.innerText === 'Gambling'){
      document.querySelector('ul.gamblingL').style.display = 'flex';
      Array.from(lists).forEach(x => {
        if(x.className !== 'gamblingL list'){ x.style.display = 'none'}
      })
    } else if (this.innerText === 'Entertainment'){
      document.querySelector('ul.entertainL').style.display = 'flex';
      Array.from(lists).forEach(x => {
        if(x.className !== 'entertainL list'){ x.style.display = 'none'}
      })
    } else if (this.innerText === 'Family Friendly'){
      document.querySelector('ul.familyL').style.display = 'flex';
      Array.from(lists).forEach(x => {
        if(x.className !== 'familyL list'){ x.style.display = 'none'}
      })
    } else if (this.innerText === 'Food & Drink'){
      document.querySelector('ul.diningL').style.display = 'flex';
      Array.from(lists).forEach(x => {
        if(x.className !== 'diningL list'){ x.style.display = 'none'}
      })
    } else {
      console.log('no dice');
    }
  // console.log(this.innerText,Array.from(lists));l
}

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteAttraction)
})

Array.from(attractionItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(attractionComplete).forEach((el)=>{
    el.addEventListener('click', markIncomplete)
})

async function deleteAttraction(){
    const attractionId = this.parentNode.dataset.id
    try{
        const response = await fetch('attractions/deleteAttraction', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'attractionIdFromJSFile': attractionId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const attractionId = this.parentNode.dataset.id
    try{
        const response = await fetch('attractions/markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'attractionIdFromJSFile': attractionId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markIncomplete(){
    const attractionId = this.parentNode.dataset.id
    try{
        const response = await fetch('attractions/markIncomplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'attractionIdFromJSFile': attractionId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}