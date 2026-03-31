import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const NeuralBackground = () => {
    const containerRef = useRef();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        camera.position.z = 5;

        // Neural Network Logic
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

            velocities[i * 3] = (Math.random() - 0.5) * 0.01;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x00f2ff,
            size: 0.05,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // Lines setup
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00f2ff,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending,
        });

        const lineGeometry = new THREE.BufferGeometry();
        const linePoints = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(linePoints);

        const animate = () => {
            requestAnimationFrame(animate);

            const pos = geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                pos[i * 3] += velocities[i * 3];
                pos[i * 3 + 1] += velocities[i * 3 + 1];
                pos[i * 3 + 2] += velocities[i * 3 + 2];

                // Boundary check
                if (Math.abs(pos[i * 3]) > 5) velocities[i * 3] *= -1;
                if (Math.abs(pos[i * 3 + 1]) > 5) velocities[i * 3 + 1] *= -1;
                if (Math.abs(pos[i * 3 + 2]) > 5) velocities[i * 3 + 2] *= -1;
            }
            geometry.attributes.position.needsUpdate = true;

            // Update lines
            const linePositions = [];
            for (let i = 0; i < particleCount; i++) {
                for (let j = i + 1; j < particleCount; j++) {
                    const dx = pos[i * 3] - pos[j * 3];
                    const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                    const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < 1.5) {
                        linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
                        linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
                    }
                }
            }
            lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            lineGeometry.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            container.removeChild(renderer.domElement);
            geometry.dispose();
            material.dispose();
            lineGeometry.dispose();
            lineMaterial.dispose();
        };
    }, []);

    return <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
};

export default NeuralBackground;
