const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

let scene;
let beams = [];

function createScene(){

    scene = new BABYLON.Scene(engine);

    // background putih
    scene.clearColor = new BABYLON.Color4(1,1,1,1);

    // camera
    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        -Math.PI/2,
        Math.PI/3,
        80,
        new BABYLON.Vector3(0,0,0),
        scene
    );

    camera.attachControl(canvas,true);

    // light
    const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0,1,0),
        scene
    );

    light.intensity = 0.9;

    // GRID
    const grid = BABYLON.MeshBuilder.CreateGround(
        "grid",
        {width:200,height:200},
        scene
    );

    const gridMat = new BABYLON.GridMaterial("gridMat",scene);

    gridMat.mainColor = new BABYLON.Color3(1,1,1);
    gridMat.lineColor = new BABYLON.Color3(0.7,0.7,0.7);
    gridMat.gridRatio = 1;
    gridMat.majorUnitFrequency = 10;
    gridMat.opacity = 0.35;

    grid.material = gridMat;

    // EVENT KLIK GLOBAL (SUPAYA SEMUA BEAM BISA DIKLIK)
    scene.onPointerObservable.add(function(pointerInfo){

        if(pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK){

            const mesh = pointerInfo.pickInfo.pickedMesh;

            if(mesh && mesh.metadata){

                showSection(mesh.metadata);

            }

        }

    });

    return scene;

}

createScene();

engine.runRenderLoop(function(){

    if(scene){
        scene.render();
    }

});

window.addEventListener("resize",function(){
    engine.resize();
});



async function loadProject(){

    clearScene();

    const res = await fetch("/structure");
    const data = await res.json();

    console.log("Total elements:",data.length);

    document.getElementById("jsonPreview").textContent =
        JSON.stringify(data.slice(0,20),null,2);

    if(data.length === 0){
        alert("Data kosong");
        return;
    }

    const scale = 0.001;

    const centerX = data[0].x1;
    const centerY = data[0].y1;
    const centerZ = data[0].z1;

    data.forEach(b => {

        if(b.x1 == null || b.x2 == null) return;

        const p1 = new BABYLON.Vector3(
            (b.x1 - centerX) * scale,
            (b.y1 - centerY) * scale,
            (b.z1 - centerZ) * scale
        );

        const p2 = new BABYLON.Vector3(
            (b.x2 - centerX) * scale,
            (b.y2 - centerY) * scale,
            (b.z2 - centerZ) * scale
        );

        const length = BABYLON.Vector3.Distance(p1,p2);

        if(length === 0) return;

        let beamWidth = 0.2;
        let beamDepth = 0.2;
        let color = new BABYLON.Color3(0,0,1);

        const type = (b.section_name || b.type || "").toUpperCase();

        // BALOK
        if(type.includes("BALOK")){

            beamWidth = 0.3;
            beamDepth = 0.3;
            color = new BABYLON.Color3(0,0,1);

        }

        // BRACING
        else if(type.includes("BRACING") || type.includes("LNP")){

            beamWidth = 0.1;
            beamDepth = 0.1;
            color = new BABYLON.Color3(1,0,0);

        }

        // KOLOM
        else if(type.includes("KOLOM") || type.includes("H")){

            color = new BABYLON.Color3(0,0.6,0);

            const match = type.match(/(\d+)\s*X\s*(\d+)/);

            if(match){

                const h = parseFloat(match[1]);
                const w = parseFloat(match[2]);

                beamWidth = w * 0.001;
                beamDepth = h * 0.001;

            }

        }

        const beam = BABYLON.MeshBuilder.CreateBox(
            "beam",
            {
                height: length,
                width: beamWidth,
                depth: beamDepth
            },
            scene
        );

        beam.position = BABYLON.Vector3.Center(p1,p2);

        beam.lookAt(p2);

        const mat = new BABYLON.StandardMaterial("mat",scene);
        mat.diffuseColor = color;

        beam.material = mat;

        // simpan data supaya bisa diklik
        beam.metadata = b;

        beams.push(beam);

    });

}



function clearScene(){

    beams.forEach(b => b.dispose());
    beams = [];

}



function showSection(b){

    const div = document.getElementById("sectionInfo");

    div.innerHTML = `
    <div class="info-item">
        <div class="info-label">Section</div>
        <div class="info-value">${b.section_name || b.type || "-"}</div>
    </div>

    <div class="info-item">
        <div class="info-label">Height</div>
        <div class="info-value">${b.height || "-"}</div>
    </div>

    <div class="info-item">
        <div class="info-label">Width</div>
        <div class="info-value">${b.width || "-"}</div>
    </div>

    <div class="info-item">
        <div class="info-label">Web Thickness</div>
        <div class="info-value">${b.web_thickness || "-"}</div>
    </div>

    <div class="info-item">
        <div class="info-label">Standard</div>
        <div class="info-value">${b.standard || "-"}</div>
    </div>
    `;

}