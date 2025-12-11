import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Package,
    ArrowLeft,
    Save,
    MapPin,
    Weight,
    Info,
    CheckCircle
} from 'lucide-react';
import './CreateBatchPage.css';

const productTypes = [
    'Grain', 'Fruit', 'Vegetable', 'Spice', 'Fiber', 'Dairy', 'Beverage', 'Other'
];

const weightUnits = ['kg', 'g', 'lb', 'ton', 'quintal'];

const CreateBatchPage = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        productName: '',
        productType: '',
        quantity: '',
        unit: 'units',
        weight: '',
        weightUnit: 'kg',
        farmName: '',
        location: '',
        harvestDate: '',
        description: '',
        certifications: [] as string[],
        generateQR: true
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const toggleCertification = (cert: string) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.includes(cert)
                ? prev.certifications.filter(c => c !== cert)
                : [...prev.certifications, cert]
        }));
    };

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.productName.trim()) {
            newErrors.productName = 'Product name is required';
        }
        if (!formData.productType) {
            newErrors.productType = 'Select a product type';
        }
        if (!formData.weight || parseFloat(formData.weight) <= 0) {
            newErrors.weight = 'Enter a valid weight';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.farmName.trim()) {
            newErrors.farmName = 'Farm name is required';
        }
        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        } else if (step === 2 && validateStep2()) {
            setStep(3);
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Navigate to batch detail page
        navigate('/dashboard/batches');
    };

    const certificationOptions = [
        'Organic Certified',
        'Fair Trade',
        'Non-GMO',
        'FSSAI Approved',
        'ISO 22000',
        'HACCP'
    ];

    return (
        <div className="create-batch-page">
            {/* Page Header */}
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                    Back
                </button>
                <div>
                    <h1 className="page-title">Create New Batch</h1>
                    <p className="page-subtitle">Register a new product batch in the system</p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="create-steps">
                <div className={`create-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'complete' : ''}`}>
                    <div className="step-circle">
                        {step > 1 ? <CheckCircle size={20} /> : '1'}
                    </div>
                    <span className="step-label">Product Details</span>
                </div>
                <div className="step-connector"></div>
                <div className={`create-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'complete' : ''}`}>
                    <div className="step-circle">
                        {step > 2 ? <CheckCircle size={20} /> : '2'}
                    </div>
                    <span className="step-label">Origin Info</span>
                </div>
                <div className="step-connector"></div>
                <div className={`create-step ${step >= 3 ? 'active' : ''}`}>
                    <div className="step-circle">3</div>
                    <span className="step-label">Review & Submit</span>
                </div>
            </div>

            {/* Form Content */}
            <div className="create-form-container">
                {step === 1 && (
                    <div className="form-section animate-fadeIn">
                        <div className="section-header">
                            <Package size={24} />
                            <div>
                                <h2>Product Details</h2>
                                <p>Enter information about the product</p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="input-group">
                                <label className="input-label">Product Name *</label>
                                <input
                                    type="text"
                                    name="productName"
                                    className={`input ${errors.productName ? 'input-error' : ''}`}
                                    placeholder="e.g., Organic Wheat"
                                    value={formData.productName}
                                    onChange={handleChange}
                                />
                                {errors.productName && <span className="input-error-text">{errors.productName}</span>}
                            </div>

                            <div className="input-group">
                                <label className="input-label">Product Type *</label>
                                <select
                                    name="productType"
                                    className={`input select ${errors.productType ? 'input-error' : ''}`}
                                    value={formData.productType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select type</option>
                                    {productTypes.map(type => (
                                        <option key={type} value={type.toLowerCase()}>{type}</option>
                                    ))}
                                </select>
                                {errors.productType && <span className="input-error-text">{errors.productType}</span>}
                            </div>

                            <div className="input-group">
                                <label className="input-label">Quantity</label>
                                <div className="input-addon-group">
                                    <input
                                        type="number"
                                        name="quantity"
                                        className="input"
                                        placeholder="Enter quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                    />
                                    <select
                                        name="unit"
                                        className="input-addon"
                                        value={formData.unit}
                                        onChange={handleChange}
                                    >
                                        <option value="units">Units</option>
                                        <option value="boxes">Boxes</option>
                                        <option value="bags">Bags</option>
                                        <option value="crates">Crates</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Weight *</label>
                                <div className="input-addon-group">
                                    <input
                                        type="number"
                                        name="weight"
                                        className={`input ${errors.weight ? 'input-error' : ''}`}
                                        placeholder="Enter weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                    />
                                    <select
                                        name="weightUnit"
                                        className="input-addon"
                                        value={formData.weightUnit}
                                        onChange={handleChange}
                                    >
                                        {weightUnits.map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.weight && <span className="input-error-text">{errors.weight}</span>}
                            </div>

                            <div className="input-group full-width">
                                <label className="input-label">Description</label>
                                <textarea
                                    name="description"
                                    className="input textarea"
                                    placeholder="Add any additional details about the product..."
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-primary btn-lg" onClick={handleNext}>
                                Continue to Origin Info
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="form-section animate-fadeIn">
                        <div className="section-header">
                            <MapPin size={24} />
                            <div>
                                <h2>Origin Information</h2>
                                <p>Where was this product sourced from?</p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="input-group">
                                <label className="input-label">Farm / Source Name *</label>
                                <input
                                    type="text"
                                    name="farmName"
                                    className={`input ${errors.farmName ? 'input-error' : ''}`}
                                    placeholder="e.g., Golden Valley Farms"
                                    value={formData.farmName}
                                    onChange={handleChange}
                                />
                                {errors.farmName && <span className="input-error-text">{errors.farmName}</span>}
                            </div>

                            <div className="input-group">
                                <label className="input-label">Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    className={`input ${errors.location ? 'input-error' : ''}`}
                                    placeholder="e.g., Punjab, India"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                                {errors.location && <span className="input-error-text">{errors.location}</span>}
                            </div>

                            <div className="input-group">
                                <label className="input-label">Harvest Date</label>
                                <input
                                    type="date"
                                    name="harvestDate"
                                    className="input"
                                    value={formData.harvestDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="input-group full-width">
                                <label className="input-label">Certifications</label>
                                <div className="certification-grid">
                                    {certificationOptions.map(cert => (
                                        <button
                                            key={cert}
                                            type="button"
                                            className={`cert-tag ${formData.certifications.includes(cert) ? 'selected' : ''}`}
                                            onClick={() => toggleCertification(cert)}
                                        >
                                            {formData.certifications.includes(cert) && <CheckCircle size={14} />}
                                            {cert}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-outline btn-lg" onClick={handleBack}>
                                Back
                            </button>
                            <button type="button" className="btn btn-primary btn-lg" onClick={handleNext}>
                                Review Batch
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="form-section animate-fadeIn">
                        <div className="section-header">
                            <Info size={24} />
                            <div>
                                <h2>Review & Submit</h2>
                                <p>Verify the batch information before submitting</p>
                            </div>
                        </div>

                        <div className="review-card">
                            <div className="review-section">
                                <h4>Product Details</h4>
                                <div className="review-grid">
                                    <div className="review-item">
                                        <span className="review-label">Product Name</span>
                                        <span className="review-value">{formData.productName}</span>
                                    </div>
                                    <div className="review-item">
                                        <span className="review-label">Product Type</span>
                                        <span className="review-value">{formData.productType}</span>
                                    </div>
                                    <div className="review-item">
                                        <span className="review-label">Weight</span>
                                        <span className="review-value">{formData.weight} {formData.weightUnit}</span>
                                    </div>
                                    {formData.quantity && (
                                        <div className="review-item">
                                            <span className="review-label">Quantity</span>
                                            <span className="review-value">{formData.quantity} {formData.unit}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="review-section">
                                <h4>Origin Information</h4>
                                <div className="review-grid">
                                    <div className="review-item">
                                        <span className="review-label">Farm Name</span>
                                        <span className="review-value">{formData.farmName}</span>
                                    </div>
                                    <div className="review-item">
                                        <span className="review-label">Location</span>
                                        <span className="review-value">{formData.location}</span>
                                    </div>
                                    {formData.harvestDate && (
                                        <div className="review-item">
                                            <span className="review-label">Harvest Date</span>
                                            <span className="review-value">{new Date(formData.harvestDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                                {formData.certifications.length > 0 && (
                                    <div className="review-certs">
                                        <span className="review-label">Certifications</span>
                                        <div className="cert-badges">
                                            {formData.certifications.map(cert => (
                                                <span key={cert} className="badge badge-success">{cert}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="review-options">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="generateQR"
                                        checked={formData.generateQR}
                                        onChange={handleChange}
                                    />
                                    <span className="checkbox-custom"></span>
                                    <span>Generate QR code for this batch</span>
                                </label>
                            </div>
                        </div>

                        <div className="info-banner">
                            <Info size={20} />
                            <p>
                                Once submitted, this batch will be registered on the blockchain and cannot be modified.
                                A unique Batch ID will be generated automatically.
                            </p>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-outline btn-lg" onClick={handleBack}>
                                Back
                            </button>
                            <button
                                type="button"
                                className={`btn btn-primary btn-lg ${isSubmitting ? 'btn-loading' : ''}`}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="btn-spinner"></span>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Create Batch
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateBatchPage;
