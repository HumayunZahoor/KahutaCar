import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './Table';

export default function ResponseView({ viewType, issueKey }) {
    console.log("View Type: ", viewType);
    console.log("Issue Key (Project Key): ", issueKey);

    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/jira/getJiraAccountData`);
                const accountData = response.data.jiraAccountData;

                console.log("Response Data:", accountData);

                if (viewType.toLowerCase() === 'project') {
                    // Display projects
                    const projectColumns = [
                        { header: 'Key', key: 'key' },
                        { header: 'Name', key: 'name' },
                        { header: 'Project Type Key', key: 'projectTypeKey' },
                        { header: 'Entity ID', key: 'entityId' },
                        { header: 'UUID', key: 'uuid' },
                    ];
                    setColumns(projectColumns);
                    setData(accountData.projects || []); // Ensure a default empty array
                } else if (viewType.toLowerCase() === 'issue') {
                    // Display issues for a specific project
                    const issueColumns = [
                        { header: 'Key', key: 'key' },
                        { header: 'Summary', key: 'summary' },
                        { header: 'Status', key: 'status' },
                        { header: 'Assignee', key: 'assignee' },
                        { header: 'Reporter', key: 'reporter' },
                    ];
                    setColumns(issueColumns);

                    // Find the project matching the issueKey (project key)
                    const matchingProject = accountData.projects.find(project => project.key === issueKey);

                    if (matchingProject && matchingProject.issues) {
                        // Map issues to the required format
                        const issuesData = matchingProject.issues.map(issue => ({
                            id: issue.id,
                            key: issue.key,
                            summary: issue.summary,
                            status: issue.status,
                            assignee: issue.assignee || 'Unassigned',
                            reporter: issue.reporter || 'Unknown',
                        }));
                        setData(issuesData);
                    } else {
                        setData([]); // No matching project or no issues
                    }
                } else if (viewType.toLowerCase() === 'issues') {
                    // Display all issues across all projects
                    const issuesColumns = [
                        { header: 'Key', key: 'key' },
                        { header: 'Summary', key: 'summary' },
                        { header: 'Status', key: 'status' },
                        { header: 'Assignee', key: 'assignee' },
                        { header: 'Reporter', key: 'reporter' },
                    ];
                    setColumns(issuesColumns);

                    // Combine all issues from all projects
                    const allIssues = accountData.projects.flatMap(project => project.issues || []).map(issue => ({
                        id: issue.id,
                        key: issue.key,
                        summary: issue.summary,
                        status: issue.status,
                        assignee: issue.assignee || 'Unassigned',
                        reporter: issue.reporter || 'Unknown',
                    }));

                    setData(allIssues);
                }
                else{
                    setData([]);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [viewType, issueKey]);

    if (loading) return <div className="text-center mt-10 text-blue-600 font-semibold">Loading...</div>;
    if (data.length === 0) return <div className="text-center mt-10 text-red-600 font-semibold">No data available</div>;

    return (
        <div className="p-8 bg-white">
            <Table columns={columns} data={data} />
        </div>
    );
}
