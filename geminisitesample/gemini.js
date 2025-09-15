/* Basic Reset and Fonts */
body {
    font-family: 'Times New Roman', Times, serif; /* Literary Feel */
    margin: 0;
    padding: 0;
    background-color: #ffffff; /* Clean white background */
    color: #333333; /* Dark, but not harsh black text */
    line-height: 1.6;
}

/* --- Header & Navigation --- */
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 5%;
    border-bottom: 1px solid #eeeeee;
}

.logo a {
    font-size: 1.8em;
    font-weight: bold;
    text-decoration: none;
    color: #000;
}

nav ul {
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;
}

nav ul li {
    margin-left: 25px;
}

nav ul li a {
    text-decoration: none;
    color: #000;
    font-weight: 500;
    font-size: 0.9em;
    letter-spacing: 0.5px;
    transition: color 0.3s;
}

nav ul li a:hover {
    color: #a0a0a0; /* Subtle hover effect */
}

.language-select a {
    text-decoration: none;
    color: #000;
    font-size: 0.9em;
}

/* --- Hero Section --- */
.hero {
    background-image: url('placeholder-hero.jpg'); /* REPLACE with your own image */
    background-size: cover;
    background-position: center;
    height: 60vh; /* Viewport height for prominence */
    display: flex;
    align-items: flex-end; /* Align content to the bottom/left */
    justify-content: flex-start;
    padding: 0 5%;
}

.hero-title {
    color: white; /* Text color over the image */
    font-size: 3em;
    margin-bottom: 20px;
    background-color: rgba(0, 0, 0, 0.3); /* Slight background for readability */
    padding: 5px 15px;
}

/* --- Main Content --- */
.content-wrapper {
    max-width: 900px; /* Constrain content width for easy reading */
    margin: 40px auto;
    padding: 0 20px;
}

h2 {
    font-size: 2em;
    margin-top: 50px;
    margin-bottom: 20px;
    text-align: center;
}

.section-divider {
    border: none;
    height: 1px;
    background-color: #e0e0e0;
    margin: 60px 0;
}

/* Latest Book Section */
#latest-book {
    text-align: center;
}

.book-info {
    display: flex;
    gap: 40px;
    align-items: flex-start;
    text-align: left;
}

.book-cover {
    width: 250px; /* Standard book cover width */
    height: auto;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.book-text p {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.1em;
}

.btn-more-info, .btn-purchase {
    display: inline-block;
    padding: 10px 20px;
    margin-right: 10px;
    border: 1px solid #000;
    color: #000;
    text-decoration: none;
    text-transform: uppercase;
    font-size: 0.9em;
    transition: background-color 0.3s, color 0.3s;
}

.btn-more-info:hover, .btn-purchase:hover {
    background-color: #000;
    color: #fff;
}

/* Bio Snippet Section */
#bio-snippet {
    text-align: center;
}

.bio-text {
    font-size: 1.2em;
    margin-bottom: 30px;
    text-align: center;
}

.btn-full-bio {
    display: inline-block;
    padding: 10px 25px;
    border: 1px solid #000;
    color: #000;
    text-decoration: none;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.9em;
    transition: background-color 0.3s, color 0.3s;
}

.btn-full-bio:hover {
    background-color: #000;
    color: #fff;
}

/* Social Media Section */
#social-media {
    text-align: center;
}

.social-links a {
    margin: 0 15px;
    color: #333;
    text-decoration: none;
    font-size: 1.1em;
    transition: color 0.3s;
}

.social-links a:hover {
    color: #999;
}

/* --- Footer --- */
footer {
    text-align: center;
    padding: 20px 0;
    border-top: 1px solid #eeeeee;
    margin-top: 50px;
    font-size: 0.85em;
    color: #777;
}

.footer-links a {
    color: #777;
    text-decoration: none;
    margin: 0 10px;
}

/* Mobile Responsiveness (adjusts layout for smaller screens) */
@media (max-width: 768px) {
    header {
        flex-direction: column;
        padding-bottom: 10px;
    }

    nav ul {
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 10px;
    }

    nav ul li {
        margin: 5px 10px;
    }

    .language-select {
        margin-top: 10px;
    }

    .hero {
        height: 40vh;
    }
    
    .book-info {
        flex-direction: column;
        align-items: center;
    }

    .book-cover {
        width: 60%;
        max-width: 250px;
        margin-bottom: 20px;
    }

    .book-text {
        text-align: center;
    }
}