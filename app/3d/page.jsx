"use client";
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ThreeDPage() {
  const containerRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Add a light to the scene
    const light = new THREE.AmbientLight(0x404040, 2); // Ambient light
    scene.add(light);

    // Load image texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('https://img.freepik.com/3d-models/BI12N6DH-bottle-with-nozzle-005/bottle-with-nozzle-005-beauty.png?w=740&t=st=1733346678~exp=1733347278~hmac=5e98ad544fabadb44345c27144ef43e676fa412ce49d9a79f9a62b9266dee103'); 

    // Create a plane geometry for the image
    const geometry = new THREE.PlaneGeometry(5, 5); // Adjust size as needed
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    camera.position.z = 5;

    // Handle mouse movement
    const onMouseMove = (event) => {
      // Normalize mouse position
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      // Apply mouse position to the plane rotation (for demonstration)
      plane.rotation.x = mouseY * Math.PI;  // Rotate based on mouse Y position
      plane.rotation.y = mouseX * Math.PI;  // Rotate based on mouse X position
    };

    // Handle mouse hover over the image
    const onMouseEnter = () => {
      setHovered(true);
      plane.material.color.set(0xff0000);  // Change image color to red when hovered (Optional)
    };

    const onMouseLeave = () => {
      setHovered(false);
      plane.material.color.set(0xffffff);  // Change image color back when not hovered (Optional)
    };

    // Add event listeners for mouse movement and hover
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mouseleave', onMouseLeave);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseleave', onMouseLeave);
      renderer.dispose();
    };
  }, []);

  return (
    <div>
      <h1>Hover Over the Image</h1>
      <div ref={containerRef} />
    </div>
  );
}
