import { useId, useState } from 'react';
import './Password_generator.css';
import { generateSitePassword } from '../../utils/password';

function PasswordGenerator() {
    const [masterPassword, setMasterPassword] = useState('');
    const [website, setWebsite] = useState('');
    const [passwordLength, setPasswordLength] = useState(16);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [generatedPasswordLength, setGeneratedPasswordLength] = useState(16);
    const [generatedPasswordSite, setGeneratedPasswordSite] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const masterPasswordId = useId();
    const websiteId = useId();
    const passwordLengthId = useId();

    const handleGeneratePassword = async (e) => {
        e.preventDefault();
        
        if (!masterPassword || !website) {
            alert('Por favor, completa todos los campos obligatorios');
            return;
        }

        setIsGenerating(true);
        
        try {
            const password = await generateSitePassword(masterPassword, website, passwordLength);
            setGeneratedPassword(password);
            setGeneratedPasswordLength(passwordLength);
            setGeneratedPasswordSite(website);
        } catch (error) {
            console.error('Error al generar la contraseña:', error);
            alert('Error al generar la contraseña. Por favor, intenta de nuevo.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopyPassword = async () => {
        if (!generatedPassword) return;
        
        try {
            await navigator.clipboard.writeText(generatedPassword);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (error) {
            console.error('Error al copiar la contraseña:', error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleClearAll = () => {
        setMasterPassword('');
        setWebsite('');
        setPasswordLength(16);
        setGeneratedPassword('');
        setGeneratedPasswordLength(16);
        setGeneratedPasswordSite('');
        setCopySuccess(false);
        setShowPassword(false);
    };

    return (
        <div className="password-generator">
            <div className="generator-container">
                <form onSubmit={handleGeneratePassword} className="generator-form">
                    <div className="form-group">
                        <label htmlFor={masterPasswordId}>Contraseña Maestra *</label>
                        <input
                            type="password"
                            id={masterPasswordId}
                            value={masterPassword}
                            onChange={(e) => setMasterPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña maestra"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor={websiteId}>Sitio Web *</label>
                        <input
                            type="text"
                            id={websiteId}
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="ejemplo.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor={passwordLengthId}>
                            Longitud de Contraseña: {passwordLength}
                        </label>
                        <input
                            type="range"
                            id={passwordLengthId}
                            min="8"
                            max="32"
                            value={passwordLength}
                            onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                            className="length-slider"
                        />
                        <div className="slider-labels">
                            <span>8</span>
                            <span>32</span>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            disabled={isGenerating}
                            className="generate-btn"
                        >
                            {isGenerating ? 'Generando...' : 'Generar Contraseña'}
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={handleClearAll}
                            className="clear-btn"
                        >
                            Limpiar
                        </button>
                    </div>
                </form>
                    <div className="password-result">
                        <h3>Contraseña Generada</h3>
                        <div className="password-display">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={generatedPassword}
                                readOnly
                                className="generated-password"
                                onClick={handleCopyPassword}
                                title="Clic para copiar la contraseña"
                            />
                            <button 
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="visibility-btn"
                                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                            <button 
                                type="button"
                                onClick={handleCopyPassword}
                                className={`copy-btn ${copySuccess ? 'copied' : ''}`}
                                title="Copiar contraseña"
                            >
                                {copySuccess ? '✓' : '📋'}
                            </button>
                        </div>
                        <p className="password-info">
                            Contraseña de {generatedPasswordLength} caracteres para <strong>{generatedPasswordSite}</strong>
                        </p>
                    </div>
            </div>
        </div>
    );
}

export default PasswordGenerator;
