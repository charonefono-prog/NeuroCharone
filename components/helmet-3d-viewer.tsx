import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";

// Only import THREE on web platform
let THREE: any = null;
let STLLoader: any = null;

if (typeof window !== "undefined") {
  try {
    THREE = require("three");
    STLLoader = require("stl-loader").STLLoader;
  } catch (e) {
    console.warn("Three.js not available", e);
  }
}

interface Point {
  id: string;
  name: string;
  position: [number, number, number];
  area: "broca" | "wernicke" | "linguagem" | "motora" | "other";
  system10_20: string;
  description: string;
}

// Mapeamento de pontos do sistema 10-20 com áreas anatômicas
const HELMET_POINTS: Point[] = [
  // Área de Broca (Frontal Inferior Esquerdo)
  {
    id: "f7",
    name: "F7",
    position: [-0.4, 0.3, 0.2],
    area: "broca",
    system10_20: "F7",
    description: "Área de Broca - Produção da fala",
  },
  {
    id: "f5",
    name: "F5",
    position: [-0.3, 0.4, 0.1],
    area: "broca",
    system10_20: "F5",
    description: "Pré-motor - Controle motor da fala",
  },

  // Área de Wernicke (Temporal Posterior Esquerdo)
  {
    id: "t5",
    name: "T5",
    position: [-0.5, 0.0, 0.15],
    area: "wernicke",
    system10_20: "T5",
    description: "Área de Wernicke - Compreensão da fala",
  },
  {
    id: "p3",
    name: "P3",
    position: [-0.3, -0.2, 0.3],
    area: "wernicke",
    system10_20: "P3",
    description: "Parietal - Processamento sensorial da linguagem",
  },

  // Área Motora (Central)
  {
    id: "c3",
    name: "C3",
    position: [-0.25, 0.0, 0.4],
    area: "motora",
    system10_20: "C3",
    description: "Córtex Motor Primário - Movimento",
  },
  {
    id: "c4",
    name: "C4",
    position: [0.25, 0.0, 0.4],
    area: "motora",
    system10_20: "C4",
    description: "Córtex Motor Primário - Movimento",
  },

  // Área de Linguagem (Frontal)
  {
    id: "f3",
    name: "F3",
    position: [-0.2, 0.4, 0.25],
    area: "linguagem",
    system10_20: "F3",
    description: "Córtex Pré-frontal - Linguagem expressiva",
  },
  {
    id: "f4",
    name: "F4",
    position: [0.2, 0.4, 0.25],
    area: "linguagem",
    system10_20: "F4",
    description: "Córtex Pré-frontal - Linguagem receptiva",
  },

  // Outros pontos importantes
  {
    id: "fz",
    name: "Fz",
    position: [0.0, 0.4, 0.3],
    area: "other",
    system10_20: "Fz",
    description: "Frontal Central",
  },
  {
    id: "cz",
    name: "Cz",
    position: [0.0, 0.0, 0.4],
    area: "other",
    system10_20: "Cz",
    description: "Central",
  },
  {
    id: "pz",
    name: "Pz",
    position: [0.0, -0.3, 0.3],
    area: "other",
    system10_20: "Pz",
    description: "Parietal Central",
  },
];

const AREA_COLORS = {
  broca: 0xff6b6b,
  wernicke: 0x4ecdc4,
  linguagem: 0xffe66d,
  motora: 0x95e1d3,
  other: 0xc7ceea,
};

export interface Helmet3DViewerProps {
  onPointSelected?: (point: Point) => void;
  selectedPointId?: string;
  showSidebar?: boolean;
}

export function Helmet3DViewer({
  onPointSelected,
  selectedPointId,
  showSidebar = true,
}: Helmet3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const helmetGroupRef = useRef<any>(null);
  const pointsRef = useRef<Map<string, any>>(new Map());
  const labelsRef = useRef<Map<string, any>>(new Map());
  const hoverPointRef = useRef<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [transparentMode, setTransparentMode] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);

  const captureScreenshot = () => {
    if (rendererRef.current) {
      const canvas = rendererRef.current.domElement;
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `capacete-3d-${new Date().getTime()}.png`;
      link.click();
    }
  };

  const createTextLabel = (text: string, position: [number, number, number]) => {
    if (!THREE) return null;
    
    try {
      // Criar canvas para textura de texto
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return null;
      
      canvas.width = 256;
      canvas.height = 256;
      
      // Fundo transparente
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Texto
      context.font = 'Bold 80px Arial';
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      
      // Criar textura
      const texture = new THREE.CanvasTexture(canvas);
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearFilter;
      
      // Criar sprite com o texto
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(0.15, 0.15, 0.15);
      sprite.position.set(...position);
      sprite.position.x += 0.08; // Offset para não ficar exatamente no ponto
      sprite.position.y += 0.08;
      
      return sprite;
    } catch (error) {
      console.error('Erro ao criar label de texto:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!containerRef.current || !THREE) {
      console.warn("Three.js not available or container not ready");
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 1.2);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Helmet group
    const helmetGroup = new THREE.Group();
    scene.add(helmetGroup);
    helmetGroupRef.current = helmetGroup;

    // Load STL models
    const loader = new STLLoader();

    // Load STL models with proper URLs
    const loadSTLModel = (url: string) => {
      return new Promise<any>((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
      });
    };

    Promise.all([
      loadSTLModel("/assets/models/M4_Medium_Front.stl"),
      loadSTLModel("/assets/models/M4_Medium_Back.stl"),
    ])
      .then(([frontGeometry, backGeometry]: any[]) => {
        // Front model
        const frontMaterial = new THREE.MeshPhongMaterial({
          color: 0x3498db,
          opacity: transparentMode ? 0.3 : 0.8,
          transparent: true,
        });
        const frontMesh = new THREE.Mesh(frontGeometry, frontMaterial);
        frontMesh.scale.set(0.001, 0.001, 0.001);
        frontMesh.userData.material = frontMaterial;
        helmetGroup.add(frontMesh);

        // Back model
        const backMaterial = new THREE.MeshPhongMaterial({
          color: 0x2980b9,
          opacity: transparentMode ? 0.2 : 0.6,
          transparent: true,
        });
        const backMesh = new THREE.Mesh(backGeometry, backMaterial);
        backMesh.scale.set(0.001, 0.001, 0.001);
        backMesh.position.z = -0.1;
        backMesh.userData.material = backMaterial;
        helmetGroup.add(backMesh);
      })
      .catch((error) => console.error("Error loading STL models:", error));

    // Add points
    HELMET_POINTS.forEach((point) => {
      const geometry = new THREE.SphereGeometry(0.05, 16, 16);
      const material = new THREE.MeshPhongMaterial({
        color: AREA_COLORS[point.area],
        emissive: 0x000000,
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(...point.position);
      sphere.userData = { pointId: point.id };
      helmetGroup.add(sphere);
      pointsRef.current.set(point.id, sphere);
      
      // Adicionar label de texto 3D
      const label = createTextLabel(point.system10_20, point.position);
      if (label) {
        helmetGroup.add(label);
        labelsRef.current.set(point.id, label);
      }
    });

    // Mouse interaction com raycasting melhorado para mobile
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Aumentar raio de detecção para mobile (hit detection)
    raycaster.params.Points.threshold = 0.15; // Aumentado de 0.1 para melhor detecção em mobile

    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Detectar hover sobre pontos
      const intersects = raycaster.intersectObjects(helmetGroup.children);
      let hoveredId: string | null = null;
      
      for (let i = 0; i < intersects.length; i++) {
        const obj = intersects[i].object as any;
        if (obj.userData.pointId && obj.geometry.type === 'SphereGeometry') {
          hoveredId = obj.userData.pointId;
          break;
        }
      }
      
      // Atualizar feedback visual de hover
      if (hoveredId !== hoverPointRef.current) {
        // Remover highlight anterior
        if (hoverPointRef.current) {
          const prevMesh = pointsRef.current.get(hoverPointRef.current);
          if (prevMesh) {
            prevMesh.scale.set(1, 1, 1);
            prevMesh.material.emissiveIntensity = 0;
          }
        }
        
        // Adicionar highlight novo
        if (hoveredId) {
          const mesh = pointsRef.current.get(hoveredId);
          if (mesh) {
            mesh.scale.set(1.5, 1.5, 1.5); // Aumentar tamanho ao passar
            mesh.material.emissiveIntensity = 0.5;
          }
        }
        
        hoverPointRef.current = hoveredId;
        setHoveredPointId(hoveredId);
      }
    };

    const onMouseClick = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(helmetGroup.children);
      for (let i = 0; i < intersects.length; i++) {
        const obj = intersects[i].object as any;
        if (obj.userData.pointId && obj.geometry.type === 'SphereGeometry') {
          const pointId = obj.userData.pointId;
          const point = HELMET_POINTS.find((p) => p.id === pointId);
          if (point) {
            setSelectedPoint(point);
            onPointSelected?.(point);
            setIsRotating(false);
          }
          break;
        }
      }
    };

    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("click", onMouseClick);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (isRotating && helmetGroup) {
        helmetGroup.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("click", onMouseClick);
      cancelAnimationFrame(animationId);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [isRotating, onPointSelected, transparentMode, showLabels]);

  // Controlar visibilidade dos labels
  useEffect(() => {
    labelsRef.current.forEach((label: any) => {
      label.visible = showLabels;
    });
  }, [showLabels]);

  // Highlight selected point
  useEffect(() => {
    pointsRef.current.forEach((mesh: any, pointId: string) => {
      if (pointId === selectedPointId) {
        mesh.material.emissive.setHex(0xffff00);
        mesh.material.emissiveIntensity = 0.8;
      } else {
        mesh.material.emissive.setHex(0x000000);
        mesh.material.emissiveIntensity = 0;
      }
    });
  }, [selectedPointId]);

  return (
      <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {typeof window !== "undefined" && (
          <div
            ref={containerRef as any}
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          />
        )}
        <TouchableOpacity
          onPress={() => setTransparentMode(!transparentMode)}
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            backgroundColor: transparentMode ? "rgba(52,152,219,0.8)" : "rgba(0,0,0,0.6)",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>
            {transparentMode ? "Modo Normal" : "Modo Transparente"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={captureScreenshot}
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            backgroundColor: "rgba(0,0,0,0.6)",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12 }}>
            📸 Screenshot
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowLabels(!showLabels)}
          style={{
            position: "absolute",
            bottom: 60,
            right: 16,
            backgroundColor: showLabels ? "rgba(52,152,219,0.8)" : "rgba(0,0,0,0.6)",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12 }}>
            {showLabels ? "🏷️ Labels" : "🏷️ Sem Labels"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsRotating(!isRotating)}
          style={{
            position: "absolute",
            bottom: 104,
            right: 16,
            backgroundColor: "rgba(0,0,0,0.6)",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12 }}>
            {isRotating ? "⏸ Pausar" : "▶ Girar"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sidebar removido - informações mostradas em modal na tela helmet-3d.tsx */}
    </View>
  );
}
