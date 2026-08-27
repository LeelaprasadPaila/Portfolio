import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectCaseStudy from '../components/ProjectCaseStudy';

const ProjectDetail = () => {
  const { projectTitle } = useParams();
  const navigate = useNavigate();
  const decodedTitle = decodeURIComponent(projectTitle);

  return (
    <ProjectCaseStudy
      projectTitle={decodedTitle}
      onBack={() => navigate('/projects')}
    />
  );
};

export default ProjectDetail;