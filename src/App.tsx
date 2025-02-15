// src/App.tsx
import React from 'react';
import ArticleGenerator from './components/ArticleGenerator';

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-background p-4">
            <ArticleGenerator />
        </div>
    );
};

export default App;
