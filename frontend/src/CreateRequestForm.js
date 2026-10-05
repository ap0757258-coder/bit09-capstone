import React, { useState, useEffect } from 'react';

const API_URL =
  process.env.REACT_APP_API_URL || 'https://docverify-asdt.onrender.com';

export default function CreateRequest({ onBack, studentId }) {
  const [docType, setDocType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    console.log('CREATE FORM MOUNTED');
    console.log('Student ID:', studentId);

    return () => {
      console.log('CREATE FORM UNMOUNTED');
    };
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('CREATE REQUEST SUBMIT CLICKED');
    console.log('Student ID being sent:', studentId);

    if (!studentId) {
      setMsg('❌ Student ID not found. Please login again.');
      return;
    }

    setLoading(true);
    setMsg('');

    try {
      const res = await fetch(`${API_URL}/api/create-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: studentId,
          documentType: docType,
          purpose: purpose
        })
      });

      console.log(
        'Create request response status:',
        res.status
      );

      const data = await res.json();

      console.log(
        'Create request response:',
        data
      );

      if (data.status === 'success') {
        setMsg('✅ Request created successfully');

        setTimeout(() => {
          if (onBack) {
            onBack();
          }
        }, 1200);
      } else {
        setMsg(
          '❌ ' +
            (data.message ||
              'Request creation failed')
        );
      }
    } catch (error) {
      console.error(
        'Create request error:',
        error
      );

      setMsg(
        '❌ Error: ' + error.message
      );
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f3f6fb',
        padding: '30px'
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}
      >

        {/* ==================================================
            HEADER
        ================================================== */}
        <div
          style={{
            background:
              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '0 0 24px 24px',
            padding: '30px 40px',
            color: '#fff',
            boxShadow:
              '0 15px 40px rgba(102,126,234,0.25)',
            marginBottom: '30px'
          }}
        >
          <button
            type="button"
            onClick={() => {
              if (onBack) {
                onBack();
              }
            }}
            style={{
              padding: '10px 18px',
              border: 'none',
              borderRadius: '9px',
              background:
                'rgba(255,255,255,0.95)',
              color: '#667eea',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              marginBottom: '22px'
            }}
          >
            ← Back
          </button>

          <div
            style={{
              fontSize: '38px',
              marginBottom: '5px'
            }}
          >
            📝
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: '36px',
              fontWeight: '700'
            }}
          >
            New Request
          </h1>

          <p
            style={{
              margin:
                '8px 0 0',
              fontSize: '18px',
              color: '#e0e7ff'
            }}
          >
            Request a new document
          </p>

          <p
            style={{
              margin:
                '7px 0 0',
              fontSize: '15px',
              color: '#ddd6fe'
            }}
          >
            Student ID:{' '}
            <strong>{studentId}</strong>
          </p>
        </div>

        {/* ==================================================
            FORM CARD
        ================================================== */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#fff',
            borderRadius: '18px',
            padding: '35px',
            boxShadow:
              '0 5px 25px rgba(0,0,0,0.07)'
          }}
        >

          {/* FORM TITLE */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '30px'
            }}
          >
            <span
              style={{
                fontSize: '28px'
              }}
            >
              📄
            </span>

            <div>
              <h2
                style={{
                  margin: 0,
                  color: '#172033',
                  fontSize: '25px'
                }}
              >
                Document Details
              </h2>

              <p
                style={{
                  margin:
                    '5px 0 0',
                  color: '#64748b',
                  fontSize: '14px'
                }}
              >
                Select the document you want to request
              </p>
            </div>
          </div>

          {/* ==================================================
              DOCUMENT TYPE
          ================================================== */}
          <div
            style={{
              marginBottom: '25px'
            }}
          >
            <label
              style={{
                display: 'block',
                marginBottom: '9px',
                fontWeight: '700',
                color: '#172033',
                fontSize: '16px'
              }}
            >
              📋 Document Type
            </label>

            <select
              value={docType}
              onChange={(e) =>
                setDocType(e.target.value)
              }
              required
              style={{
                width: '100%',
                padding: '14px 15px',
                border:
                  '1px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '16px',
                background: '#fff',
                color: '#172033',
                boxSizing: 'border-box',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">
                Select document...
              </option>

              <option value="Bonafide Letter">
                Bonafide Letter
              </option>

              <option value="Transcript">
                Transcript
              </option>

              <option value="Character Certificate">
                Character Certificate
              </option>

              <option value="12th Marksheet">
                12th Marksheet
              </option>

              <option value="Leaving Certificate">
                Leaving Certificate
              </option>

              <option value="Migration Certificate">
                Migration Certificate
              </option>

              <option value="Degree Certificate">
                Degree Certificate
              </option>

              <option value="Provisional Certificate">
                Provisional Certificate
              </option>

              <option value="No Objection Certificate">
                No Objection Certificate (NOC)
              </option>

              <option value="Fee Receipt">
                Fee Receipt
              </option>

              <option value="Gap Certificate">
                Gap Certificate
              </option>

              <option value="Attendance Certificate">
                Attendance Certificate
              </option>
            </select>
          </div>

          {/* ==================================================
              PURPOSE
          ================================================== */}
          <div
            style={{
              marginBottom: '25px'
            }}
          >
            <label
              style={{
                display: 'block',
                marginBottom: '9px',
                fontWeight: '700',
                color: '#172033',
                fontSize: '16px'
              }}
            >
              📌 Purpose
            </label>

            <textarea
              value={purpose}
              onChange={(e) =>
                setPurpose(e.target.value)
              }
              placeholder="Why do you need this document?"
              required
              rows="6"
              style={{
                width: '100%',
                padding: '14px 15px',
                border:
                  '1px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '16px',
                resize: 'vertical',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                color: '#172033',
                outline: 'none'
              }}
            />
          </div>

          {/* ==================================================
              MESSAGE
          ================================================== */}
          {msg && (
            <div
              style={{
                marginBottom: '22px',
                padding: '14px 16px',
                borderRadius: '10px',
                background:
                  msg.startsWith('✅')
                    ? '#d1fae5'
                    : '#fee2e2',
                color:
                  msg.startsWith('✅')
                    ? '#047857'
                    : '#b91c1c',
                border:
                  msg.startsWith('✅')
                    ? '1px solid #6ee7b7'
                    : '1px solid #fca5a5',
                fontWeight: '600'
              }}
            >
              {msg}
            </div>
          )}

          {/* ==================================================
              SUBMIT
          ================================================== */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              border: 'none',
              borderRadius: '10px',
              background: loading
                ? '#9ca3af'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              fontSize: '17px',
              fontWeight: '700',
              cursor: loading
                ? 'not-allowed'
                : 'pointer',
              boxShadow: loading
                ? 'none'
                : '0 6px 18px rgba(102,126,234,0.25)'
            }}
          >
            {loading
              ? '⏳ Creating...'
              : '✓ Create Request'}
          </button>

        </form>
      </div>
    </div>
  );
}
