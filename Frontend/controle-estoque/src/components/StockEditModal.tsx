import { useState, useEffect } from "react";
import ButtonMain from "./ButtonMain";
import "./StockEditModal.css";
import type { Produto } from "./Table";

type Props = {
  onClose: () => void;
  productToEdit: Produto;
};

const StockEditModal = ({ onClose, productToEdit }: Props) => {
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState<number | "">("");
  const [productPrice, setProductPrice] = useState<number | "">("");
  const [productExpiry, setProductExpiry] = useState<Date | "">("");
  const [productId, setProductId] = useState<number | "">("");

  useEffect(() => {
    if (productToEdit) {
      setProductName(productToEdit.produto);
      setProductQuantity(productToEdit.quantidade);
      setProductPrice(productToEdit.valor);
      setProductExpiry(parseDateFromLocale(productToEdit.validade) || "");
      setProductId(productToEdit.id);
    }
  }, [productToEdit]);

  const parseDateFromLocale = (dateString: string): Date | "" => {
    const [day, month, year] = dateString.split("/").map(Number);
    if (!day || !month || !year) return "";
    return new Date(year, month - 1, day);
  };

  const handleSave = async () => {
    if (!productName || !productQuantity || !productPrice || !productExpiry) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    console.log(productExpiry.toISOString().split("T")[0]);
    const productData = {
      nome: productName,
      preco: productPrice,
      quantidade: productQuantity,
      validade: productExpiry.toISOString().split("T")[0],
    };

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/produtos/" + productId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal-container">
        <div className="modal-header">
          <h1>Editar produto</h1>
          <div onClick={() => onClose()} className="close-modal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M14.1211 12.0002L23.5608 2.56161C24.1467 1.97565 24.1467 1.02563 23.5608 0.439714C22.9748 -0.146246 22.0248 -0.146246 21.4389 0.439714L12.0002 9.8793L2.56161 0.439714C1.97565 -0.146246 1.02563 -0.146246 0.439714 0.439714C-0.146199 1.02567 -0.146246 1.9757 0.439714 2.56161L9.8793 12.0002L0.439714 21.4389C-0.146246 22.0248 -0.146246 22.9748 0.439714 23.5608C1.02567 24.1467 1.9757 24.1467 2.56161 23.5608L12.0002 14.1211L21.4388 23.5608C22.0248 24.1467 22.9748 24.1467 23.5607 23.5608C24.1467 22.9748 24.1467 22.0248 23.5607 21.4389L14.1211 12.0002Z"
                fill="#0D0D0D"
              />
            </svg>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="product-name">Nome do produto</label>
          <input
            id="product-name"
            type="text"
            className="input-modal"
            placeholder="Coca-Cola Lata"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />

          <label htmlFor="product-quantity">Quantidade</label>
          <input
            id="product-quantity"
            type="number"
            className="input-modal"
            placeholder="50"
            value={productQuantity}
            onChange={(e) =>
              setProductQuantity(
                e.target.value ? parseInt(e.target.value, 10) : ""
              )
            }
          />

          <label htmlFor="product-price">Valor (R$)</label>
          <input
            id="product-price"
            type="number"
            step="0.01"
            className="input-modal"
            placeholder="5.99"
            value={productPrice}
            onChange={(e) =>
              setProductPrice(e.target.value ? parseFloat(e.target.value) : "")
            }
          />

          <label htmlFor="product-expiry">Validade</label>
          <input
            id="product-expiry"
            type="date"
            className="input-modal"
            value={
              productExpiry ? productExpiry.toISOString().split("T")[0] : ""
            }
            onChange={(e) => {
              const dateParts = e.target.value.split("-");
              const utcDate = new Date(
                parseInt(dateParts[0], 10), // Ano
                parseInt(dateParts[1], 10) - 1, // Mês (0-indexado)
                parseInt(dateParts[2], 10) // Dia
              );
              setProductExpiry(e.target.value ? utcDate : "");
            }}
          />
        </div>
        <ButtonMain text="Salvar" disabled={false} onClick={handleSave} />
      </div>
    </div>
  );
};

export default StockEditModal;
