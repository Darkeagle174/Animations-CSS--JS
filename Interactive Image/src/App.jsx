import './App.css'

function App() {

  const images = document.getElementsByClassName("image");

  let globalIndex = 0,
    last = {x:0, y:0};

  const activate = (image, x, y) => {
    image.style.left = `${x}px`;
    image.style.top = `${y}px`;

    image.dataset.status = "active";

    last = {x, y}
  }

  const distanceFromLast = (x, y) => {
    return Math.hypot(x - last.x,y - last.y)
  }

  window.onmousemove = e => {
    if(distanceFromLast(e.clientX, e.clientY) > 100){
    const lead = images[globalIndex % images.length],
    tail = images[(globalIndex - 5) % images.length]

    activate(lead, e.clientX, e.clientY);

    if(tail) tail.dataset.status = "inactive";

    globalIndex++;
    }
  }

  return (
    <>
    <img class="image" data-index="0" data-status="inactive" src="https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"/>
    <img class="image" data-index="1" data-status="inactive" src="https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"/>
    <img class="image" data-index="2" data-status="inactive" src="https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"/>
    <img class="image" data-index="3" data-status="inactive" src="https://images.pexels.com/photos/30791852/pexels-photo-30791852/free-photo-of-majestic-snow-capped-mountain-at-sunset.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"/>
    <img class="image" data-index="4" data-status="inactive" src="https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"/>
    <img class="image" data-index="5" data-status="inactive" src="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"/>
    <img class="image" data-index="6" data-status="inactive" src="https://images.pexels.com/photos/30791448/pexels-photo-30791448/free-photo-of-breathtaking-patagonia-waterfall-with-mountain-view.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"/>
    <img class="image" data-index="7" data-status="inactive" src="https://images.pexels.com/photos/1486974/pexels-photo-1486974.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"/>
    <img class="image" data-index="8" data-status="inactive" src="https://images.pexels.com/photos/30826606/pexels-photo-30826606/free-photo-of-serene-waterfall-in-tobago-s-lush-jungle.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"/>
    <img class="image" data-index="9" data-status="inactive" src="https://images.pexels.com/photos/30780718/pexels-photo-30780718/free-photo-of-aerial-view-of-person-in-yellow-raincoat-walking-across-rice-field.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"/>
    <img class="image" data-index="10" data-status="inactive" src="https://images.pexels.com/photos/30784285/pexels-photo-30784285/free-photo-of-serene-coastal-road-overlooking-blue-ocean.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"/>
    </>
  )
}

export default App
