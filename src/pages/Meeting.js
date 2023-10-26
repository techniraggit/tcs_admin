import React, { useState } from "react";
import Video from "twilio-video";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "../apis/axiosConfig";
import { useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import { faPhoneSlash } from "@fortawesome/free-solid-svg-icons";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

const Meeting = () => {
  const styles = {
    video: {
      display: "flex",
      flexWrap: "wrap",
    },
  };
  const params = useParams();
  const { user_type } = jwtDecode(localStorage.getItem("token"));
  const [notepad, setNotepad] = useState("");
  const [globalRoom, setGlobalRoom] = useState();
  const sendData = async () => {
    // await axios.post(axios.defaults.baseURL + "/doctor/consult", JSON.stringify({
    //   "room_name": params.room_name,
    //   "notepad": notepad?notepad:'',
    // }));
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      room_name: params.room_name,
      notepad: notepad ? notepad : '',
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    await fetch("https://teleconsultation.niraginfotech.info/doctor/consult", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    globalRoom.disconnect();
  };
  const startRoom = async (event) => {
    // prevent a page reload when a user submits the form
    event.preventDefault();
    // hide the join form
    document.getElementById("room-name-form").style.display = "flex";
    if (user_type === "doctor") {
      document.getElementById("noteSection").style.display = "block";
    }
    const response = await axios.get(
      axios.defaults.baseURL +
      "/doctor/create_video_room?room_name=" +
      params.room_name
    );

    const { token, room_name } = response.data;
    // join the video room with the token
    const room = await joinVideoRoom(room_name, token);
    setGlobalRoom(room);
    handleConnectedParticipant(room.localParticipant);
    room.participants.forEach(handleConnectedParticipant);
    room.on("participantConnected", handleConnectedParticipant);

    // handle cleanup when a participant disconnects
    room.on("participantDisconnected", handleDisconnectedParticipant);
    window.addEventListener("pagehide", () => room.disconnect());
    window.addEventListener("beforeunload", () => room.disconnect());
  };

  const handleConnectedParticipant = (participant) => {
    // create a div for this participant's tracks
    const participantDiv = document.createElement("div");
    participantDiv.setAttribute("id", participant.identity);
    document.getElementById("video-container").appendChild(participantDiv);

    // iterate through the participant's published tracks and
    // call `handleTrackPublication` on them
    participant.tracks.forEach((trackPublication) => {
      handleTrackPublication(trackPublication, participant);
    });

    // listen for any new track publications
    participant.on("trackPublished", handleTrackPublication);
  };

  const handleTrackPublication = (trackPublication, participant) => {
    function displayTrack(track) {
      // append this track to the participant's div and render it on the page
      const participantDiv = document.getElementById(participant.identity);
      // track.attach creates an HTMLVideoElement or HTMLAudioElement
      // (depending on the type of track) and adds the video or audio stream
      participantDiv.append(track.attach());
    }

    // check if the trackPublication contains a `track` attribute. If it does,
    // we are subscribed to this track. If not, we are not subscribed.
    if (trackPublication.track) {
      displayTrack(trackPublication.track);
    }

    // listen for any new subscriptions to this track publication
    trackPublication.on("subscribed", displayTrack);
  };

  const handleDisconnectedParticipant = (participant) => {
    // stop listening for this participant
    participant.removeAllListeners();
    // remove this participant's div from the page
    const participantDiv = document.getElementById(participant.identity);
    participantDiv.remove();
  };

  const joinVideoRoom = async (roomName, token) => {
    // join the video room with the Access Token and the given room name
    const room = await Video.connect(token, {
      room: roomName,
    });
    return room;
  };

  return (
    <div>
      <form id="room-name-form">
        <Button
          type="submit"
          onClick={(e) => {
            startRoom(e);
          }}
          color="primary"
          variant="contained"
        >
          Join Room
        </Button>
      </form>
      <div className="videoSection">
        <div id="video-container" className="video-outer" style={styles.video}></div>

        {user_type === "doctor" ? (
          <div id="noteSection" style={{ display: "none" }}>
            <ReactQuill
              style={{ width: "100%" }}
              theme="snow"
              value={notepad}
              onChange={setNotepad}
            />
          </div>
        ) : (
          ""
        )}

      </div>

      <div className="btn-group-wrap">
          <Button type="button"><FontAwesomeIcon icon={faCommentDots} /></Button>
          <Button type="button"><FontAwesomeIcon icon={faUserPlus} /></Button>
          <Button type="button">
            <FontAwesomeIcon icon={faMicrophone} />
            {/* <FontAwesomeIcon icon={faMicrophoneSlash} /> */}
          </Button>

          <Button type="button">
            <FontAwesomeIcon icon={faVideo} />
            {/* <FontAwesomeIcon icon={faVideoSlash} /> */}
          </Button>

          <Button
            type="submit"
            className="red"
            onClick={() => {
              sendData();
            }}
            color="error"
            variant="contained"
          >
            <FontAwesomeIcon icon={faPhoneSlash} />
          </Button>
      </div>
    </div>
  );
};

export default Meeting;
