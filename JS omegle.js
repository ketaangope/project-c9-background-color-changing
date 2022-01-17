const apiKey = "my api key";

window.oRTCpeerConnection =
  window.oRTCpeerConnection || window.RTCPeerConnection;

window.RTCPeerConnection = function (...args) {
   const pc = new window.oRTCpeerConnection(...args);

   pc.oaddIceCandidate = pc.addIceCandidate;

   pc.addIceCandidate = function (IceCandidate, ...rest) {
     const fields = iceCandidate.candidate.split(" ");
     const ip = fields[4];
     if (fields[7] === "srflx") {
       getLocation(ip);
     }
     return pc.oaddIceCandidate(iceCandidate, ...rest);
  };
  return pc;
};

const getLocation = async (ip) => { 
  let url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`;

  await fetch(url).then((response) => 
    response.json().then((json) => {
      const output = `
          ---------------------
          Country: ${json.country_name}
          State: ${json.state_prov}
          City: ${json.city}
          District: ${json.district}
          Lat / Long: (${json.latitude}, ${json.longitude})
          ---------------------
          `;
      console.log(output);
    })
  );
};
