import React, { useState, useEffect } from "react";
import { IProfile } from "../../models/IProfile";
import { ERol } from "../../models/ERol";
import ProfileDetail from "./ProfileDetail";
import ManageLayout from "../../layouts/ManageLayout";
import ProfileControl from "./ProfileControl";
import GridLayout from "../../layouts/GridLayout";

interface IProfileManagementProps {
  profiles: IProfile[];
  rol: ERol;
  onProfileStateChange?(id: string, state: boolean): void;
}

const ProfileManagement: React.FunctionComponent<IProfileManagementProps> = ({
  profiles,
  rol,
  onProfileStateChange,
}) => {
  const [list, setList] = useState<any[]>(
    profiles.map((profile) => (
      <ProfileDetail
        profile={profile}
        rol={rol}
        onProfileStateChange={onProfileStateChange}
        key={profile.id}
      />
    ))
  );
  const [filterText, setFilterText] = useState("");

  const onFilterText = (filter: string) => {
    setList(
      profiles
        .filter(
          (profile) =>
            (profile.id?.includes(filter) && rol === ERol.Admin) ||
            profile.name.toLowerCase().includes(filter.toLowerCase()) ||
            profile.alternative?.toLowerCase().includes(filter.toLowerCase()) ||
            profile.description.toLowerCase().includes(filter.toLowerCase())
        )
        .map((profile) => (
          <ProfileDetail
            profile={profile}
            rol={rol}
            onProfileStateChange={onProfileStateChange}
            key={profile.id}
          />
        ))
    );
    setFilterText(filter);
  };

  useEffect(() => {
    onFilterText(filterText);
  }, [profiles]);

  return (
    <ManageLayout
      title={`${rol === ERol.Admin ? "Gestionar p" : "P"}erfiles de exámenes`}
      subTitle="¡Todos nuestros perfiles!"
      controls={<ProfileControl rol={rol} onFilterText={onFilterText} />}
      list={<GridLayout list={list} defaultText="No hay perfiles!!!" />}
    />
  );
};

export default ProfileManagement;
