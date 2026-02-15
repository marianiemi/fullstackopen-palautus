import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";

import patientService from "../services/patients";
import { Patient, Entry } from "../types";

const GenderIcon = ({ gender }: { gender: Patient["gender"] }) => {
  switch (gender) {
    case "male":
      return <MaleIcon />;
    case "female":
      return <FemaleIcon />;
    default:
      return <TransgenderIcon />;
  }
};

const EntryItem = ({ entry }: { entry: Entry }) => {
  return (
    <div style={{ marginBottom: "1em" }}>
      <Typography variant="body1">
        <b>{entry.date}</b> {entry.description}
      </Typography>

      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <ul>
          {entry.diagnosisCodes.map((code) => (
            <li key={code}>{code}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPatient = async () => {
      const data = await patientService.getById(id);
      setPatient(data);
    };

    void fetchPatient();
  }, [id]);

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        style={{ marginTop: "1em" }}
      >
        <Typography variant="h5">{patient.name}</Typography>
        <GenderIcon gender={patient.gender} />
      </Box>

      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>

      <Typography variant="h6" style={{ marginTop: "1em" }}>
        entries
      </Typography>

      {patient.entries.map((entry) => (
        <EntryItem key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default PatientPage;
