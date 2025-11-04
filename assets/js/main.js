const DATA_URL = 'data/resume.json';

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const create = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
};

const renderChip = (label, href) => {
  const link = create('a', 'chip', label);
  link.href = href;
  if (href.startsWith('http')) {
    link.target = '_blank';
    link.rel = 'noreferrer';
  }
  return link;
};

const renderTimelineItem = (item) => {
  const container = create('article', 'timeline__item');

  const heading = create('div', 'timeline__heading');
  const role = create('h3', 'timeline__role', item.role);
  heading.append(role);

  if (item.company) {
    const company = create('span', 'badge', item.company);
    heading.append(company);
  }

  container.append(heading);

  const meta = create('div', 'timeline__meta');
  if (item.period) meta.append(create('span', '', item.period));
  if (item.location) meta.append(create('span', '', item.location));
  if (item.teamSize) meta.append(create('span', '', `Team size: ${item.teamSize}`));
  container.append(meta);

  if (Array.isArray(item.achievements) && item.achievements.length) {
    const list = create('ul', 'timeline__points');
    item.achievements.forEach((achievement) => {
      const li = document.createElement('li');
      li.textContent = achievement;
      list.append(li);
    });
    container.append(list);
  }

  if (Array.isArray(item.tech) && item.tech.length) {
    const techGroup = create('div', 'timeline__meta');
    item.tech.forEach((tech) => techGroup.append(renderChip(tech, '#')));
    container.append(techGroup);
  }

  return container;
};

const renderProjectCard = (project) => {
  const card = create('article', 'card');
  const title = create('h3', 'card__title', project.name);
  card.append(title);

  if (project.role) {
    card.append(create('p', 'card__subtitle', project.role));
  }

  if (project.description) {
    const description = create('p', '', project.description);
    card.append(description);
  }

  if (Array.isArray(project.highlights) && project.highlights.length) {
    const list = create('ul', 'timeline__points');
    project.highlights.forEach((highlight) => {
      const li = document.createElement('li');
      li.textContent = highlight;
      list.append(li);
    });
    card.append(list);
  }

  if (Array.isArray(project.techStack) && project.techStack.length) {
    const chips = create('div', 'hero__meta');
    project.techStack.forEach((item) => chips.append(renderChip(item, '#')));
    card.append(chips);
  }

  if (project.links) {
    const linkContainer = create('div', 'hero__meta');
    Object.entries(project.links).forEach(([label, href]) => {
      if (!href) return;
      linkContainer.append(renderChip(label, href));
    });
    if (linkContainer.children.length) {
      card.append(linkContainer);
    }
  }

  return card;
};

const renderSkillGroup = (group) => {
  const wrapper = create('article', 'skill-group');
  wrapper.append(create('h3', '', group.title));
  if (Array.isArray(group.items) && group.items.length) {
    const list = document.createElement('ul');
    group.items.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      list.append(li);
    });
    wrapper.append(list);
  }
  return wrapper;
};

const renderEducationCard = (education) => {
  const card = create('article', 'card');
  card.append(create('h3', 'card__title', education.institution));
  card.append(create('p', 'card__subtitle', `${education.degree}${education.period ? ` · ${education.period}` : ''}`));
  if (Array.isArray(education.details) && education.details.length) {
    const list = create('ul', 'timeline__points');
    education.details.forEach((detail) => {
      const li = document.createElement('li');
      li.textContent = detail;
      list.append(li);
    });
    card.append(list);
  }
  return card;
};

const renderCertificationItem = (certification) => {
  const item = create('li', 'list__item');
  item.append(create('span', '', certification.name));
  if (certification.issuer || certification.year) {
    const meta = create('span', 'timeline__meta');
    meta.textContent = [certification.issuer, certification.year].filter(Boolean).join(' · ');
    item.append(meta);
  }
  return item;
};

const renderAboutSection = (aboutContainer, content) => {
  if (!content) return;
  if (Array.isArray(content)) {
    aboutContainer.innerHTML = '';
    content.forEach((paragraph) => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      aboutContainer.append(p);
    });
  } else {
    aboutContainer.textContent = content;
  }
};

const renderLinks = (container, links = []) => {
  container.innerHTML = '';
  links.forEach(({ label, url }) => container.append(renderChip(label, url)));
};

const renderContact = (container, contact) => {
  if (!contact) return;
  container.innerHTML = '';
  if (contact.message) {
    const message = create('p', '', contact.message);
    container.append(message);
  }
  if (contact.email) {
    const emailButton = renderChip(contact.email, `mailto:${contact.email}`);
    emailButton.classList.add('button');
    container.append(emailButton);
  }
  if (contact.links) {
    const linkGroup = create('div', 'hero__meta');
    Object.entries(contact.links).forEach(([label, url]) => {
      linkGroup.append(renderChip(label, url));
    });
    container.append(linkGroup);
  }
};

const renderResume = (data) => {
  const heroSubtitle = qs('[data-field="tagline"]');
  const heroSummary = qs('[data-field="summary"]');
  const heroLinks = qs('[data-field="links"]');
  const about = qs('[data-field="about"]');
  const experience = qs('[data-field="experience"]');
  const projects = qs('[data-field="projects"]');
  const skills = qs('[data-field="skills"]');
  const education = qs('[data-field="education"]');
  const certifications = qs('[data-field="certifications"]');
  const contact = qs('[data-field="contact"]');
  const footerYear = qs('[data-field="footerYear"]');

  if (data.tagline) heroSubtitle.textContent = data.tagline;
  if (data.summary) heroSummary.textContent = data.summary;
  if (Array.isArray(data.links)) renderLinks(heroLinks, data.links);
  renderAboutSection(about, data.about);

  experience.innerHTML = '';
  if (Array.isArray(data.experience)) {
    data.experience.forEach((item) => experience.append(renderTimelineItem(item)));
  }

  projects.innerHTML = '';
  if (Array.isArray(data.projects)) {
    data.projects.forEach((project) => projects.append(renderProjectCard(project)));
  }

  skills.innerHTML = '';
  if (Array.isArray(data.skills)) {
    data.skills.forEach((group) => skills.append(renderSkillGroup(group)));
  }

  education.innerHTML = '';
  if (Array.isArray(data.education)) {
    data.education.forEach((item) => education.append(renderEducationCard(item)));
  }

  certifications.innerHTML = '';
  if (Array.isArray(data.certifications) && data.certifications.length) {
    data.certifications.forEach((item) => certifications.append(renderCertificationItem(item)));
  } else {
    const placeholder = create('li', 'list__item');
    placeholder.textContent = 'Add your certifications to highlight continuous learning.';
    certifications.append(placeholder);
  }

  renderContact(contact, data.contact);

  if (footerYear) footerYear.textContent = new Date().getFullYear().toString();
};

const toggleNavigation = () => {
  const toggle = qs('.menu-toggle');
  const nav = qs('#site-nav');
  if (!toggle || !nav) return;

  const closeNav = () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', (!isOpen).toString());
    nav.setAttribute('aria-hidden', isOpen.toString());
  });

  qsa('#site-nav a').forEach((link) => link.addEventListener('click', closeNav));

  closeNav();
};

const loadResume = async () => {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Failed to load resume data: ${response.status}`);
    const data = await response.json();
    renderResume(data);
  } catch (error) {
    console.error(error);
    const fallback = qs('[data-field="experience"]');
    if (fallback && !fallback.children.length) {
      const notice = create('article', 'timeline__item');
      notice.append(create('h3', 'timeline__role', 'Resume data unavailable'));
      notice.append(create('p', '', 'Update data/resume.json with your information to render your experience.'));
      fallback.append(notice);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  toggleNavigation();
  loadResume();
});
