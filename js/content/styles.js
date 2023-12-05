export const stylingForHiddenPost = `
    .hidden-post-message {
        font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
        font-size: 20px;
        border: 2px solid #ddd;
        padding: 10px;
        text-align: center;
        font-weight: bold;
        color: #666;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1),
                    0 6px 20px rgba(0,0,0,0.05);
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .hidden-post-message:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.2),
                    0 8px 24px rgba(0,0,0,0.1);
    }
`;
