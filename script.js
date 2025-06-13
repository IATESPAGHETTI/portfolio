const githubUsername = 'IATESPAGHETTI';

fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated`)
  .then(res => res.json())
  .then(repos => {
    const container = document.getElementById('github-projects');
    container.innerHTML = '';
    repos.slice(0, 6).forEach(repo => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
        <p>${repo.description ? repo.description : 'No description.'}</p>
        <div style="font-size:0.92rem;color:#666;">
          <span>★ ${repo.stargazers_count}</span>
          <span style="margin-left:10px;">${repo.language || ''}</span>
        </div>
      `;
      container.appendChild(card);
    });
  })
  .catch(() => {
    document.getElementById('github-projects').innerHTML = '<p>Could not load projects.</p>';
  });
