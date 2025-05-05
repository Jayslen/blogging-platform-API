DROP DATABASE IF EXISTS posts;
CREATE DATABASE posts;
USE posts;

CREATE TABLE tags (
	id INT AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE categories (
	id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE post (
	id BINARY(16) PRIMARY KEY DEFAULT(UUID_TO_BIN(UUID())),
    title VARCHAR(60) NOT NULL,
    content TEXT NOT NULL,
    category INT,
    FOREIGN KEY(category) REFERENCES categories(id),
    createdAT TIMESTAMP DEFAULT(CURRENT_TIMESTAMP),
    updatedAT TIMESTAMP DEFAULT(CURRENT_TIMESTAMP)
);

CREATE TABLE posts_tags(
	id INT AUTO_INCREMENT PRIMARY KEY,
    post_id BINARY(16),
    tag_id INT,
    UNIQUE(post_id, tag_id),
    FOREIGN KEY(post_id) REFERENCES post(id) ON DELETE CASCADE,
    FOREIGN KEY(tag_id) REFERENCES tags(id)
);

CREATE OR REPLACE VIEW posts_views AS
SELECT BIN_TO_UUID(p.id) AS id, p.title ,p.content, c.title AS category, p.createdAT, p.updatedAT
FROM post AS p
INNER JOIN categories AS c ON c.id = p.category;

CREATE OR REPLACE VIEW posts_with_tags AS
SELECT BIN_TO_UUID(p.id) AS id, p.title, p.content, c.title AS category, t.title AS tag, p.createdAt, p.updatedAt
FROM posts_tags pt
INNER JOIN post AS p ON p.id = pt.post_id
INNER JOIN categories AS c ON c.id = p.category
INNER JOIN tags AS t ON t.id = pt.tag_id;

INSERT INTO tags (title) VALUES 
('JavaScript'),
('Node.js'),
('MySQL'),
('Backend'),
('Frontend');

INSERT INTO categories (title) VALUES 
('Programming'),
('Web Development'),
('Databases'),
('Tutorials');

INSERT INTO post (id, title, content, category) VALUES 
(UUID_TO_BIN('11111111-1111-1111-1111-111111111111'), 'Node Basics', 'Intro to Node.js basics.', 1),
(UUID_TO_BIN('22222222-2222-2222-2222-222222222222'), 'MySQL Guide', 'Complete MySQL guide.', 3),
(UUID_TO_BIN('33333333-3333-3333-3333-333333333333'), 'JavaScript 101', 'Learn JavaScript step by step.', 2);

INSERT INTO posts_tags (post_id, tag_id) VALUES 
(UUID_TO_BIN('11111111-1111-1111-1111-111111111111'), 2),  
(UUID_TO_BIN('11111111-1111-1111-1111-111111111111'), 4), 
(UUID_TO_BIN('22222222-2222-2222-2222-222222222222'), 3), 
(UUID_TO_BIN('33333333-3333-3333-3333-333333333333'), 1), 
(UUID_TO_BIN('33333333-3333-3333-3333-333333333333'), 5);

SELECT * FROM posts_with_tags;



