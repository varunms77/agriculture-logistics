import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    GitBranch,
    Package,
    Plus,
    Trash2,
    AlertTriangle,
    CheckCircle,
    Loader,
    Info
} from 'lucide-react';
import './BatchSplitPage.css';

// Mock parent batch
const parentBatch = {
    id: '1',
    batchId: 'ORG-2024-0847',
    product: 'Organic Wheat',
    totalWeight: 500,
    unit: 'kg',
    status: 'in_transit',
    origin: 'Golden Valley Farms, Punjab',
};

interface ChildBatch {
    id: string;
    weight: number;
    destination: string;
    notes: string;
}

const BatchSplitPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [childBatches, setChildBatches] = useState<ChildBatch[]>([
        { id: '1', weight: 0, destination: '', notes: '' },
    ]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const totalAllocated = childBatches.reduce((sum, batch) => sum + (batch.weight || 0), 0);
    const remaining = parentBatch.totalWeight - totalAllocated;

    const addChildBatch = () => {
        setChildBatches([
            ...childBatches,
            { id: Date.now().toString(), weight: 0, destination: '', notes: '' },
        ]);
    };

    const removeChildBatch = (id: string) => {
        if (childBatches.length > 1) {
            setChildBatches(childBatches.filter(b => b.id !== id));
        }
    };

    const updateChildBatch = (id: string, field: keyof ChildBatch, value: string | number) => {
        setChildBatches(childBatches.map(batch =>
            batch.id === id ? { ...batch, [field]: value } : batch
        ));
        // Clear errors
        if (errors[`${id}-${field}`]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[`${id}-${field}`];
                return newErrors;
            });
        }
    };

    const distributeEvenly = () => {
        const weightPerBatch = Math.floor(parentBatch.totalWeight / childBatches.length);
        const remainder = parentBatch.totalWeight % childBatches.length;

        setChildBatches(childBatches.map((batch, index) => ({
            ...batch,
            weight: weightPerBatch + (index === 0 ? remainder : 0),
        })));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (totalAllocated !== parentBatch.totalWeight) {
            newErrors.total = `Total weight must equal ${parentBatch.totalWeight} ${parentBatch.unit}`;
        }

        childBatches.forEach((batch) => {
            if (!batch.weight || batch.weight <= 0) {
                newErrors[`${batch.id}-weight`] = 'Weight is required';
            }
            if (!batch.destination.trim()) {
                newErrors[`${batch.id}-destination`] = 'Destination is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2500));

        setSubmitSuccess(true);
    };

    if (submitSuccess) {
        return (
            <div className="batch-split-page">
                <div className="success-screen">
                    <div className="success-icon">
                        <CheckCircle size={64} />
                    </div>
                    <h2>Batch Split Successful</h2>
                    <p>The batch has been split into {childBatches.length} child batches</p>

                    <div className="new-batches-list">
                        {childBatches.map((batch, index) => (
                            <div key={batch.id} className="new-batch-item">
                                <span className="new-batch-id font-mono">{parentBatch.batchId}-{String.fromCharCode(65 + index)}</span>
                                <span className="new-batch-weight">{batch.weight} {parentBatch.unit}</span>
                                <span className="new-batch-dest">{batch.destination}</span>
                            </div>
                        ))}
                    </div>

                    <div className="success-actions">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/dashboard/batches/${id}`)}
                        >
                            View Parent Batch
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => navigate('/dashboard/batches')}
                        >
                            Go to Batches
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="batch-split-page">
            {/* Header */}
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                    Back
                </button>
                <div>
                    <h1 className="page-title">Split Batch</h1>
                    <p className="page-subtitle">Divide this batch into smaller child batches</p>
                </div>
            </div>

            {/* Parent Batch Info */}
            <div className="parent-batch-card">
                <div className="parent-batch-header">
                    <div className="parent-icon">
                        <Package size={24} />
                    </div>
                    <div className="parent-info">
                        <span className="parent-id font-mono">{parentBatch.batchId}</span>
                        <h3>{parentBatch.product}</h3>
                        <span className="parent-origin">{parentBatch.origin}</span>
                    </div>
                    <div className="parent-weight">
                        <span className="weight-value">{parentBatch.totalWeight}</span>
                        <span className="weight-unit">{parentBatch.unit}</span>
                    </div>
                </div>
            </div>

            {/* Split Form */}
            <form onSubmit={handleSubmit} className="split-form">
                {/* Weight Distribution */}
                <div className="weight-distribution">
                    <div className="dist-header">
                        <h3>Weight Distribution</h3>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={distributeEvenly}>
                            Distribute Evenly
                        </button>
                    </div>

                    <div className="dist-bar">
                        <div
                            className="dist-allocated"
                            style={{ width: `${(totalAllocated / parentBatch.totalWeight) * 100}%` }}
                        />
                    </div>

                    <div className="dist-stats">
                        <span className="allocated">
                            <span className="dot allocated"></span>
                            Allocated: {totalAllocated} {parentBatch.unit}
                        </span>
                        <span className={`remaining ${remaining < 0 ? 'error' : remaining > 0 ? 'warning' : 'success'}`}>
                            <span className={`dot ${remaining < 0 ? 'error' : remaining > 0 ? 'warning' : 'success'}`}></span>
                            {remaining === 0 ? 'Fully allocated' :
                                remaining > 0 ? `Remaining: ${remaining} ${parentBatch.unit}` :
                                    `Over by: ${Math.abs(remaining)} ${parentBatch.unit}`}
                        </span>
                    </div>

                    {errors.total && (
                        <div className="dist-error">
                            <AlertTriangle size={16} />
                            {errors.total}
                        </div>
                    )}
                </div>

                {/* Child Batches */}
                <div className="child-batches-section">
                    <div className="section-header">
                        <h3>
                            <GitBranch size={20} />
                            Child Batches ({childBatches.length})
                        </h3>
                    </div>

                    <div className="child-batches-list">
                        {childBatches.map((batch, index) => (
                            <div key={batch.id} className="child-batch-card">
                                <div className="child-batch-header">
                                    <span className="child-batch-label">
                                        Child Batch {String.fromCharCode(65 + index)}
                                    </span>
                                    <span className="child-batch-id font-mono">
                                        {parentBatch.batchId}-{String.fromCharCode(65 + index)}
                                    </span>
                                    {childBatches.length > 1 && (
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => removeChildBatch(batch.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                <div className="child-batch-form">
                                    <div className="input-group">
                                        <label className="input-label">Weight *</label>
                                        <div className="input-addon-group">
                                            <input
                                                type="number"
                                                className={`input ${errors[`${batch.id}-weight`] ? 'input-error' : ''}`}
                                                placeholder="0"
                                                min="0"
                                                max={parentBatch.totalWeight}
                                                value={batch.weight || ''}
                                                onChange={(e) => updateChildBatch(batch.id, 'weight', parseFloat(e.target.value) || 0)}
                                            />
                                            <span className="input-addon">{parentBatch.unit}</span>
                                        </div>
                                        {errors[`${batch.id}-weight`] && (
                                            <span className="input-error-text">{errors[`${batch.id}-weight`]}</span>
                                        )}
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Destination *</label>
                                        <input
                                            type="text"
                                            className={`input ${errors[`${batch.id}-destination`] ? 'input-error' : ''}`}
                                            placeholder="e.g., Delhi Distribution Center"
                                            value={batch.destination}
                                            onChange={(e) => updateChildBatch(batch.id, 'destination', e.target.value)}
                                        />
                                        {errors[`${batch.id}-destination`] && (
                                            <span className="input-error-text">{errors[`${batch.id}-destination`]}</span>
                                        )}
                                    </div>

                                    <div className="input-group full-width">
                                        <label className="input-label">Notes (Optional)</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="Additional notes for this child batch"
                                            value={batch.notes}
                                            onChange={(e) => updateChildBatch(batch.id, 'notes', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="add-batch-btn"
                        onClick={addChildBatch}
                    >
                        <Plus size={20} />
                        Add Another Child Batch
                    </button>
                </div>

                {/* Info Notice */}
                <div className="split-notice">
                    <Info size={20} />
                    <div className="notice-content">
                        <strong>Important</strong>
                        <p>Splitting a batch will create new batch IDs for each child. Each child batch will inherit the parent's lineage and can be tracked independently.</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-outline btn-lg"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`btn btn-primary btn-lg ${isSubmitting ? 'btn-loading' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader size={20} className="spinner" />
                                Splitting Batch...
                            </>
                        ) : (
                            <>
                                <GitBranch size={20} />
                                Split Batch
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BatchSplitPage;
