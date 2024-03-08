import { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { api } from "../../services/api";

import { Container, Links, Content } from "./styles";

import { Tag } from "../../Components/Tag";
import { Header } from "../../Components/Header";
import { Button } from "../../Components/Button";
import { Section } from "../../Components/Section";
import { ButtonText } from "../../Components/ButtonText";

export function Details() {
  const [data, setData] = useState(null);

  const params = useParams();
  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  async function handleRemove() {
    const confirm = window.confirm("Deseja realmente remover a nota?");
    if (confirm) {
      await api.delete(`/notes/${params.id}`);
      handleBack();
    }
  }

  useEffect(() => {
    async function fetchNote() {
      try {
        const response = await api.get(`/notes/${params.id}`);
        setData(response.data);
      } catch (error) {
        if (error.message || error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert("Não foi possível trazer a nota");
        }
        navigate("/");
      }
    }

    fetchNote();
  }, []);

  return (
    <Container>
      <Header />
      {data && (
        <main>
          <Content>
            <ButtonText title="excluir nota" onClick={handleRemove} />
            <h1>{data.title}</h1>

            <p>{data.description}</p>

            {data.links && (
              <Section title="Links Úteis">
                <Links>
                  {data.links.map(link => (
                    <li key={String(link.id)}>
                      <a href={link.url} target="_blank">
                        {link.url}
                      </a>
                    </li>
                  ))}
                </Links>
              </Section>
            )}

            {data.tags && (
              <Section title="Marcadores">
                {data.tags.map(tag => (
                  <Tag key={tag.id} title={tag.name} />
                ))}
              </Section>
            )}
            <Button title="Voltar" onClick={handleBack} />
          </Content>
        </main>
      )}
    </Container>
  );
}
