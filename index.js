require("@babel/polyfill");

/* eslint-disable */ 
/* eslint-disable */ var $433b644962c26f49$export$2e2bcd8739ae039 = login = async (email, password)=>{
    try {
        const res = await fetch("http://localhost:5000/api/v1/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message);
        }
        console.log(res);
        alert("Logged in successfully!");
        window.setTimeout(()=>{
            location.assign("/");
        }, 1500);
        const data = await res.json();
        console.log(data);
    } catch (err) {
        console.log(err);
        alert(err);
    }
};


/* eslint-disable */ var $b521082dd449d16e$export$2e2bcd8739ae039 = dispalyMap = (locations)=>{
    console.log(locations);
    mapboxgl.accessToken = "pk.eyJ1IjoiaWJyYWhpbWFza2FyLTExIiwiYSI6ImNsZG8ycm9nMzA1eTgzcXJzb3QxdzZvYnYifQ.ckorA7c_SujyqnkGZAwpFg";
    var map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/ibrahimaskar-11/cldo34dua000d01pgvvf80ac5",
        scrollZoom: false
    });
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((loc)=>{
        const el = document.createElement("div");
        el.className = "marker";
        new mapboxgl.Marker({
            element: el,
            anchor: "bottom"
        }).setLngLat(loc.coordinates).addTo(map);
        new mapboxgl.Popup({
            offset: 30
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description} </p>`).addTo(map);
        bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};


const $c74e663a61ed842a$var$locations = JSON.parse(document.getElementById("map").dataset.locations);
(0, $b521082dd449d16e$export$2e2bcd8739ae039)($c74e663a61ed842a$var$locations);
document.querySelector(".form").addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, $433b644962c26f49$export$2e2bcd8739ae039)(email, password);
});


//# sourceMappingURL=index.js.map
