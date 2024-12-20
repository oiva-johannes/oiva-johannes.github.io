function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}

function showWriting(postId, pushState = true) {
    showSection('writings');

    const writingContent = document.getElementById('writing-content');
    const postContent = document.getElementById(postId);
    
    if (postContent) {
        writingContent.innerHTML = postContent.innerHTML;
    } else {
        writingContent.innerHTML = '<p>Post not found</p>';
    }

    document.getElementById('post-list').style.display = 'none';
    writingContent.style.display = 'block';
    
    if (pushState) {
        history.pushState({ section: 'writings', post: postId }, '', `#writings/${postId}`);
    }
}

function showWritingsList(pushState = true) {
    showSection('writings');
    document.getElementById('writing-content').innerHTML = '';
    document.getElementById('post-list').style.display = 'block';
    document.getElementById('writing-content').style.display = 'none';
    
    if (pushState) {
        history.pushState({ section: 'writings' }, '', '#writings');
    }
}

function navigateToSection(sectionId, pushState = true) {
    showSection(sectionId);
    if (pushState) {
        history.pushState({ section: sectionId }, '', `#${sectionId}`);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for navigation
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            const href = e.target.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                if (href.startsWith('#writings/')) {
                    const postId = href.split('/')[1];
                    showWriting(postId);
                } else {
                    const sectionId = href.slice(1);
                    if (sectionId === 'writings') {
                        showWritingsList();
                    } else {
                        navigateToSection(sectionId);
                    }
                }
            }
        }
    });

    // Handle initial page load
    const hash = window.location.hash.slice(1);
    if (hash) {
        if (hash.startsWith('writings/')) {
            const postId = hash.split('/')[1];
            showWriting(postId, false);
        } else if (hash === 'writings') {
            showWritingsList(false);
        } else {
            navigateToSection(hash, false);
        }
    } else {
        navigateToSection('about', true);
    }

    // Add popstate event listener
    window.addEventListener('popstate', function(event) {
        const state = event.state;
        if (state) {
            if (state.section === 'writings' && state.post) {
                showWriting(state.post, false);
            } else if (state.section === 'writings') {
                showWritingsList(false);
            } else {
                navigateToSection(state.section, false);
            }
        } else {
            // Handle the case when there's no state (initial page load)
            const hash = window.location.hash.slice(1);
            if (hash) {
                if (hash.startsWith('writings/')) {
                    const postId = hash.split('/')[1];
                    showWriting(postId, false);
                } else if (hash === 'writings') {
                    showWritingsList(false);
                } else {
                    navigateToSection(hash, false);
                }
            } else {
                navigateToSection('about', false);
            }
        }
    });
});
