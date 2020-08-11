import React, { useState, useEffect } from "react";
import { IProfile } from "../../models/IProfile";
import { ERol } from "../../models/ERol";
import ProfileDetail from "./ProfileDetail";
import ManageLayout from "../../layouts/ManageLayout";
import ProfileControl from "./ProfileControl";
import GridLayout from "../../layouts/GridLayout";
import { IProfileTest } from "../../models/IProfileTest";

interface IProfileManagementProps {
  profiles: IProfile[];
  rol: ERol;
  profile_tests: IProfileTest[];
  onProfileStateChange?(id: string, state: boolean): void;
}

const ProfileManagement: React.FunctionComponent<IProfileManagementProps> = ({
  profiles,
  rol,
  profile_tests,
  onProfileStateChange,
}) => {
  const getCurrentProfileTests = (idProfile: string) => {
    return profile_tests.filter((pt) => pt.profile === idProfile);
  };

  const [list, setList] = useState<any[]>(
    profiles.map((profile) => (
      <ProfileDetail
        profile={profile}
        rol={rol}
        onProfileStateChange={onProfileStateChange}
        profile_tests={getCurrentProfileTests(profile.id as string)}
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
            profile_tests={getCurrentProfileTests(profile.id as string)}
            key={profile.id}
          />
        ))
    );
    setFilterText(filter);
  };

  useEffect(() => {
    onFilterText(filterText);
  }, [profiles, profile_tests]);

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
