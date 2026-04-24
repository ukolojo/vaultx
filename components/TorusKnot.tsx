"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function TorusKnot() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < 640) return;

    const mount = mountRef.current;
    if (!mount) return;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Torus knot geometry
    const geometry = new THREE.TorusKnotGeometry(
      0.8, 0.25, 200, 32, 2, 3
    );

    // Wireframe material — orange
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xff6b35,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });

    // Solid material — dark with orange sheen
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85,
    });

    const solid = new THREE.Mesh(geometry, solidMat);
    const wire = new THREE.Mesh(geometry, wireMat);
    scene.add(solid);
    scene.add(wire);

    // Lighting
    const ambientLight = new THREE.AmbientLight(
      0xffffff, 0.2
    );
    scene.add(ambientLight);

    const orangeLight = new THREE.PointLight(
      0xff6b35, 2, 10
    );
    orangeLight.position.set(2, 2, 2);
    scene.add(orangeLight);

    const whiteLight = new THREE.PointLight(
      0xffffff, 0.5, 10
    );
    whiteLight.position.set(-2, -2, 1);
    scene.add(whiteLight);

    // Mouse interaction
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    function handleMouseMove(e: MouseEvent) {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }

    mount.addEventListener("mousemove", handleMouseMove);

    // Animation
    let frameId: number;
    function animate() {
      frameId = requestAnimationFrame(animate);

      // Smooth mouse follow
      target.x += (mouse.x - target.x) * 0.05;
      target.y += (mouse.y - target.y) * 0.05;

      solid.rotation.x += 0.003;
      solid.rotation.y += 0.005;
      solid.rotation.x += target.y * 0.01;
      solid.rotation.y += target.x * 0.01;

      wire.rotation.x = solid.rotation.x;
      wire.rotation.y = solid.rotation.y;

      // Pulse orange light
      orangeLight.intensity =
        1.5 + Math.sin(Date.now() * 0.002) * 0.5;

      renderer.render(scene, camera);
    }

    animate();

    // Resize
    function handleResize() {
      if (!mount) return;
      camera.aspect =
        mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mount.clientWidth,
        mount.clientHeight
      );
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      mount.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      solidMat.dispose();
      wireMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        zIndex: 0,
        opacity: 0.7,
      }}
    />
  );
}