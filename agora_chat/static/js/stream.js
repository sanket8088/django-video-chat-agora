// const AgoraRTC_N4161 = require("../assets/AgoraRTC_N-4.16.1")

const APP_ID = "0c966074888049acbb9e48aefce1f3ff"
const CHANNEL = sessionStorage.getItem('room')
const TOKEN = sessionStorage.getItem('token')


let UID = Number(sessionStorage.getItem("UID"));

console.log("sadas")

const client = AgoraRTC.createClient({"mode" : "rtc", "codec" : "vp8"})

let localTracks = []
let remoteUsers = {} 

let joinDisplayLocalStream = async () =>{
    document.getElementById("room-name").innerText(CHANNEL)
    client.on('user-published', handleUserJoined)
    client.on('user-left', handleUserLeft)

    await client.join(APP_ID, CHANNEL, TOKEN, UID)
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()
    player = `<div class="video-container" id="user-container-${UID}">
        <div class="username-wrapper"><span class="user-name">My name</span></div>
        <div class="video-player" id="user-${UID}"></div>
        </div>`

        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
    
    localTracks[1].play(`user-${UID}`)

    await client.publish(localTracks[0], localTracks[1])
}

// let handleUserJoined = async (user, mediaType) =>{
//     console.log("dsadas")
//     remoteUsers[user.uid] = user
//     await client.subscribe(user, mediaType)
//     console.log("new user joined", mediaType)
//     if (mediaType === 'video'){
//         let player = document.getElementById(`user-container-${user.uid}`)
//         console.log(player)
//         if (player !=null){
//             player.remove()
//         }
//         player = `<div class="video-container" id="user-container-${user.uid}">
//         <div class="username-wrapper"><span class="user-name">My name</span></div>
//         <div class="video-player" id="user-${user.uid}"></div>
//         </div>`

//         document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
//         user.videoTrack.play(`user-${user.uid}`)

//     } 

//     if (mediaType === 'audio'){
//         user.audioTrack.play()
//     }
// }

let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user
    await client.subscribe(user, mediaType)

    if (mediaType === 'video'){
        console.log("video joined")
        let player = document.getElementById(`user-container-${user.uid}`)
        console.log("helllooo joined")
        console.log(player, "joined")
        if (player != null){
            player.remove()
        }

        player = `<div  class="video-container" id="user-container-${user.uid}">
            <div class="username-wrapper"><span class="user-name">My name</span></div>
            <div class="video-player" id="user-${user.uid}"></div>
        </div>`

        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType === 'audio'){
        user.audioTrack.play()
        let player = document.getElementById(`user-container-${user.uid}`)
        console.log("helllooo joined")
        console.log(player, "joined")
        if (player != null){
            player.remove()
        }

        player = `<div  class="video-container" id="user-container-${user.uid}">
            <div class="username-wrapper"><span class="user-name">${user.uid}</span></div>
            <div class="video-player" id="user-${user.uid}"></div>
        </div>`

        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
        user.videoTrack.play(`user-${user.uid}`)
        console.log("audio joined")
        
    }
}

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream = async () =>{
    for (let i=0; localTracks.length > i; i++){
        localTracks[i].stop()
        localTracks[i].close()

    }
    await client.leave()
    window.open('/', '_self')

}
let toggleCamera = async (e) => {
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}


let toggleMic = async (e) => {
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}

joinDisplayLocalStream()

document.getElementById("leave-btn").addEventListener('click', leaveAndRemoveLocalStream)
document.getElementById('camera-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleMic)