import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

type Job = {
  id: string;
  customerName: string;
  address: string;
  lat: number;
  lon: number;
};

type JobsMapProps = {
  jobs: Job[];
};

// Custom icon for the map markers
const customIcon = new Icon({
  iconUrl: "/favicon.ico",
  iconSize: [25, 25],
});

const JobsMap = ({ jobs }: JobsMapProps) => {
  // Filter out jobs that don't have coordinates
  const jobsWithCoords = jobs.filter((job) => job.lat && job.lon);

  if (jobsWithCoords.length === 0) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-muted rounded-md">
        <p>No jobs with location data to display on the map.</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[jobsWithCoords[0].lat, jobsWithCoords[0].lon]}
      zoom={11}
      scrollWheelZoom={false}
      style={{ height: "600px", width: "100%", borderRadius: "0.5rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {jobsWithCoords.map((job) => (
        <Marker key={job.id} position={[job.lat, job.lon]} icon={customIcon}>
          <Popup>
            <strong>{job.customerName}</strong>
            <br />
            {job.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default JobsMap;