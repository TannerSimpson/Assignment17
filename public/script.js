const getCrafts = async () => {
    try {
        return (await fetch("/api/crafts")).json();
    } catch (error) {
        console.error(error);
    }
};

const showCrafts = async () => {
    const crafts = await getCrafts();
    const craftsContainer = document.getElementById("crafts-container");
    craftsContainer.innerHTML = "";

    crafts.forEach((craft) => {
        const craftDiv = document.createElement("div");
        craftDiv.classList.add("craft");
        
        const a = document.createElement("a");
        a.href = "#";
        craftDiv.appendChild(a);

        const craftImage = document.createElement("img");
        craftImage.src = "images/" + craft.image;
        craftImage.alt = craft.name;
        a.appendChild(craftImage);

        a.onclick = (e) => {
            e.preventDefault();
            displayCraftDetails(craft);
        };

        craftsContainer.appendChild(craftDiv);
    });
};

const displayCraftDetails = (craft) => {
    openDialog("dialog-details");

    const craftDetails = document.getElementById("dialog-details");
    craftDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = craft.name;
    craftDetails.appendChild(h3);

    const img = document.createElement("img");
    img.src = "images/" + craft.image;
    img.alt = craft.name;
    craftDetails.appendChild(img);

    const p = document.createElement("p");
    p.innerHTML = craft.description;
    craftDetails.appendChild(p);

    const ul = document.createElement("ul");
    craftDetails.appendChild(ul);

    craft.supplies.forEach((supply) => {
        const li = document.createElement("li");
        li.innerHTML = supply;
        ul.appendChild(li);
    });
};

const openDialog = (id) => {
    document.getElementById("dialog").style.display = "block";
    document.querySelectorAll("#dialog-details > *").forEach((item)=> {
        item.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
}

const showCraftForm = (e) => {
    e.preventDefault();
    resetForm();
    document.getElementById("add-link").removeEventListener("click", displayCraftDetails); 
    openDialog("add-edit-craft-form");
};

const resetForm = () => {
    const form = document.getElementById("add-edit-craft-form");
    if (form) {
        form.reset();
        document.getElementById("supply-boxes").innerHTML = "";
        document.getElementById("img-prev").src = "";
    } else {
        console.error("Form element not found");
    }
};

const addSupply = (e) => {
    e.preventDefault();
    const section = document.getElementById("supply-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.appendChild(input);
};

const populateEditForm = (craft) => {
    const form = document.getElementById("add-edit-craft-form");
}

const addCraft = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-edit-craft-form");
    const formData = new FormData(form);
    formData.append("supplies", getSupplies());

    
        const response = await fetch("/api/crafts", {
            method: "POST",
            body: formData
        });

        if(response.status != 200){
            console.log("error posting data");
        }

        await response.json();
        resetForm();
        document.getElementById("dialog").style.display = "none";
        showCrafts();
    
};

const getSupplies = () => {
    const inputs = document.querySelectorAll("#supply-boxes input");
    const supplies = [];

    inputs.forEach((input) => {
        supplies.push(input.value);
    });

    return supplies.join(",");
};

showCrafts();
document.getElementById("add-link").onclick = showCraftForm;
document.getElementById("add-supply").onclick = addSupply;
document.getElementById("add-edit-craft-form").onsubmit = addCraft;
document.getElementById("img").onchange = (e) => {
    const prev = document.getElementById("img-prev");

    if (!e.target.files.length) {
        prev.src = "";
        return;
    }

    prev.src = URL.createObjectURL(e.target.files.item(0));
};