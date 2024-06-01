document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = 'http://localhost:3000'; // Replace with your backend URL

    async function fetchClicksBySource(linkId) {
        const response = await fetch(`${baseUrl}/links/stats/${linkId}`);
        const data = await response.json();
        return data;
    }

    async function fetchClicksByUser(userId) {
        const response = await fetch(`${baseUrl}/users/${userId}/links`);
        const data = await response.json();
        return data;
    }

    async function renderClicksBySourceChart(linkId) {
        const data = await fetchClicksBySource(linkId);

        const ctx = document.getElementById('clicksBySourceChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.sources.map(source => source.name),
                datasets: [{
                    label: 'Clicks by Source',
                    data: data.sources.map(source => source.count),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Clicks by Source'
                    }
                }
            },
        });
    }

    async function renderClicksByLinkChart(userId) {
        const data = await fetchClicksByUser(userId);

        const links = data.links.map(link => link.originalUrl);
        const clicks = data.links.map(link => link.clicks.length);

        const ctx = document.getElementById('clicksByLinkChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: links,
                datasets: [{
                    label: 'Total Clicks',
                    data: clicks,
                    backgroundColor: '#36A2EB',
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Total Clicks by Link'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Links'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Clicks'
                        }
                    }
                }
            },
        });
    }

    async function renderClicksByDayChart(userId) {
        const data = await fetchClicksByUser(userId);

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const clicksByDay = new Array(7).fill(0);

        data.links.forEach(link => {
            link.clicks.forEach(click => {
                const day = new Date(click.insertedAt).getDay();
                clicksByDay[day]++;
            });
        });

        const ctx = document.getElementById('clicksByDayChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Clicks by Day of the Week',
                    data: clicksByDay,
                    backgroundColor: '#FFCE56',
                    borderColor: '#FFCE56',
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Clicks by Day of the Week'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Day of the Week'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Clicks'
                        }
                    }
                }
            },
        });
    }

    // Fetch and render data for specific link and user
    const exampleLinkId = 'your-link-id'; // Replace with actual link ID
    const exampleUserId = 'your-user-id'; // Replace with actual user ID

    renderClicksBySourceChart(exampleLinkId);
    renderClicksByLinkChart(exampleUserId);
    renderClicksByDayChart(exampleUserId);
});
