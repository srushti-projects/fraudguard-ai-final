import numpy as np
import re

class URLVectorizer:
    def fit(self, X, y=None):
        return self
    def transform(self, URLs):
        features = []
        for url in URLs:
            url_str = str(url).lower()
            feat = [
                len(url_str),
                url_str.count('.'),
                url_str.count('-'),
                url_str.count('/'),
                1 if 'login' in url_str else 0,
                1 if 'secure' in url_str else 0,
                1 if 'verify' in url_str else 0,
                1 if 'update' in url_str else 0,
                1 if re.search(r'\d{1,3}(\.\d{1,3}){3}', url_str) else 0 # has ip
            ]
            features.append(feat)
        return np.array(features)

class FileFeatureVectorizer:
    def fit(self, X, y=None):
        return self
    def transform(self, inputs):
        features = []
        for inp in inputs:
            parts = str(inp).split('|||')
            fname = parts[0].lower()
            length = int(parts[1]) if len(parts)>1 else 0
            
            sus_words = sum(1 for w in ['scam', 'fake', 'urgent', 'drop', 'hidden', 'malware'] if w in fname)
            has_exe = 1 if fname.endswith('.exe') or fname.endswith('.scr') else 0
            has_double_ext = 1 if fname.count('.') > 1 else 0
            
            features.append([
                length,
                sus_words,
                has_exe,
                has_double_ext
            ])
        return np.array(features)
