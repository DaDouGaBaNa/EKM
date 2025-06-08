export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Méthode non autorisée
    return;
  }

  const { data } = req.body;
  if (!data) {
    res.status(400).json({ error: 'Missing data' });
    return;
  }

  const json = JSON.stringify(data, null, 2);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="race_data_${new Date().toISOString().slice(0,10)}.json"`
  );
  res.status(200).send(json);
}